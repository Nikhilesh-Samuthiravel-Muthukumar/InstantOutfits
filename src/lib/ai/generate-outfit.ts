import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import type { WardrobeItem } from "~/app/wardrobe/actions";
import { env } from "~/env";
import { type GeneratedOutfit, OutfitSchema } from "~/lib/ai/outfit-schema";

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
): string {
  const itemList = items
    .map(
      (item) =>
        `- ID: ${item.id} | ${item.category}${item.name ? ` "${item.name}"` : ""} | Color: ${item.color || "unspecified"} | Tags: ${item.tags.join(", ") || "none"} | Notes: ${item.notes || "none"}`,
    )
    .join("\n");

  const quizSummary = Object.entries(quizAnswers)
    .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");

  return `Current season: ${season}

USER STYLE PROFILE (from quiz):
${quizSummary}

WARDROBE ITEMS — you MUST select ONLY from the IDs below:
${itemList}

Compose a complete, cohesive outfit for this user. Select item IDs that work together as a full look, then explain your choices as a professional stylist would.`;
}

const SYSTEM_PROMPT = `You are a professional fashion stylist with deep expertise in color theory, outfit coordination, and personal style curation.

Your job: given a user's style quiz profile and their actual wardrobe items, select items to compose one complete, cohesive outfit.

Hard rules:
- You MUST ONLY reference item IDs from the wardrobe list provided. Never invent items.
- Select 2–6 items that together make a complete look (e.g. top + bottom + shoes, or dress + shoes + accessory).
- Never select duplicate categories unless it makes clear styling sense (e.g. two layering pieces).

Soft rules:
- Prioritise the user's stated aesthetic preferences and occasion needs from their quiz answers.
- Consider the current season: avoid suggesting heavy layers in summer or light pieces in winter.
- Explain your rationale with the confident, specific voice of a real stylist — not generic advice.
- The fit score should honestly reflect how well this outfit matches the user's style profile.`;

export async function generateOutfit(
  quizAnswers: QuizAnswers,
  items: WardrobeItem[],
): Promise<GeneratedOutfit> {
  if (items.length === 0) {
    throw new Error(
      "No wardrobe items found. Add some items to your wardrobe first.",
    );
  }

  const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const season = getSeason();

  const { object } = await generateObject({
    model: anthropic("claude-haiku-4-5-20251001"),
    schema: OutfitSchema,
    system: SYSTEM_PROMPT,
    prompt: buildPrompt(quizAnswers, items, season),
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
