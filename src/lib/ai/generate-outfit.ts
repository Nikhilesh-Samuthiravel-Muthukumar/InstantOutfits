import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import type { WardrobeItem } from "~/app/wardrobe/actions";
import { env } from "~/env";
import { type GeneratedOutfit, OutfitSchema } from "~/lib/ai/outfit-schema";
import { getPostHogClient } from "~/lib/posthog/server";

type QuizAnswers = Record<string, string | string[]>;

function getSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Autumn";
  return "Winter";
}

function buildPrompt(
  quizAnswers: QuizAnswers,
  items: WardrobeItem[],
  season: string,
  anchorItemId?: string,
  noOuterwear = false,
): string {
  const anchorItem = anchorItemId ? items.find((i) => i.id === anchorItemId) : null;

  const itemList = items
    .map(
      (item) =>
        `- ID: ${item.id} | ${item.category}${item.name ? ` "${item.name}"` : ""} | Color: ${item.color || "unspecified"} | Tags: ${item.tags.join(", ") || "none"} | Notes: ${item.notes || "none"}`,
    )
    .join("\n");

  const quizSummary = Object.entries(quizAnswers)
    .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");

  const anchorBlock = anchorItem
    ? `\nANCHOR PIECE — build the entire outfit around this item, it MUST appear in selectedItemIds:
- ID: ${anchorItem.id} | ${anchorItem.category}${anchorItem.name ? ` "${anchorItem.name}"` : ""} | Color: ${anchorItem.color || "unspecified"}\n`
    : "";

  const outerwearBlock = noOuterwear
    ? "\nUSER CONSTRAINT: Do NOT include any outerwear (jackets, coats, hoodies, blazers, or any outer layer) in this outfit.\n"
    : "";

  return `Current season: ${season}
${anchorBlock}${outerwearBlock}
USER STYLE PROFILE (from quiz):
${quizSummary}

WARDROBE ITEMS — you MUST select ONLY from the IDs below:
${itemList}

Compose a complete, cohesive outfit for this user. Select item IDs that work together as a full look, then explain your choices as a professional stylist would.`;
}

const SYSTEM_PROMPT = `You are a professional fashion stylist with deep expertise in color theory, outfit coordination, and personal style curation.

Your job: given a user's style quiz profile and their actual wardrobe items, select items that belong to the SAME occasion tier and compose one complete, cohesive outfit.

OCCASION TIERS — every item belongs to exactly one tier. Never mix items from different tiers:
  LOUNGE/SLEEP: pajamas, pjs, sleep shorts, robes, loungewear, slippers, nightwear — these NEVER appear in a real outfit
  ATHLETIC: gym wear, workout clothes, sports bras, leggings meant for exercise, athletic shorts, trainers/sneakers used for sport
  CASUAL: everyday basics, jeans, t-shirts, flannels, hoodies, sneakers, casual tops
  STREETWEAR: graphic tees, cargo pants, jordan/basketball shoes, caps, statement pieces, urban/hype gear
  SMART-CASUAL: chinos, button-downs, loafers, blazers, midi skirts, clean sneakers
  FORMAL/EVENT: suits, dress shirts, dress trousers, formal dresses, heels, dress shoes, ties

Before selecting any item, mentally assign it to a tier based on its name, category, tags, and notes. Then pick a single target tier and only select items from that tier.

Hard rules:
- NEVER include loungewear or sleepwear (pajamas, pjs, sleep items, robes) in any outfit — these are not wearable outside the home
- NEVER mix tiers: a flannel shirt (CASUAL) does not pair with pajama bottoms (LOUNGE/SLEEP); gym leggings (ATHLETIC) do not pair with dress shoes (FORMAL)
- You MUST ONLY reference item IDs from the wardrobe list provided. Never invent items.
- Select 2–5 items that form a complete look (top + bottom + shoes minimum when available)
- Never select duplicate categories unless layering clearly makes sense
- If an ANCHOR PIECE is specified, determine its tier first, then only select items from that same tier to complement it

Soft rules:
- Choose the tier that best matches the user's stated occasions and aesthetics from their quiz
- Consider season: avoid heavy layers in summer, light pieces in winter
- Write rationale with the confident, specific voice of a real stylist
- Fit score should honestly reflect how well the outfit matches the user's style profile`;

export async function generateOutfit(
  quizAnswers: QuizAnswers,
  items: WardrobeItem[],
  distinctId: string,
  anchorItemId?: string,
  noOuterwear = false,
): Promise<GeneratedOutfit> {
  if (items.length === 0) {
    throw new Error(
      "No wardrobe items found. Add some items to your wardrobe first.",
    );
  }

  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key is not configured.");
  }
  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const season = getSeason();
  const phClient = getPostHogClient();
  const generationStart = Date.now();

  const { object, usage } = await generateObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: OutfitSchema,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(quizAnswers, items, season, anchorItemId, noOuterwear),
  });

  phClient.capture({
    distinctId,
    event: "$ai_generation",
    properties: {
      $ai_provider: "anthropic",
      $ai_model: "claude-haiku-4-5-20251001",
      $ai_input_tokens: usage.inputTokens,
      $ai_output_tokens: usage.outputTokens,
      $ai_latency: (Date.now() - generationStart) / 1000,
    },
  });

  // Validate all returned IDs exist in the user's wardrobe
  const validIds = new Set(items.map((i) => i.id));
  const sanitised = {
    ...object,
    selectedItemIds: object.selectedItemIds.filter((id) => validIds.has(id)),
  };

  if (sanitised.selectedItemIds.length === 0) {
    throw new Error("The model returned no valid wardrobe items. Try again.");
  }

  return sanitised;
}
