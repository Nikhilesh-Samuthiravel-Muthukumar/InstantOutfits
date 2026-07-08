"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateOutfit } from "~/lib/ai/generate-outfit";
import type { GeneratedOutfit } from "~/lib/ai/outfit-schema";
import { createClient } from "~/lib/supabase/server";

export type SavedOutfit = {
  id: string;
  user_id: string;
  item_ids: string[];
  rationale: string;
  occasion: string;
  fit_score: number;
  styling_tips: string;
  color_story: string;
  created_at: string;
};

export async function generateOutfitAction(profileId?: string, anchorItemId?: string, noOuterwear = false): Promise<{
  outfit?: GeneratedOutfit;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/outfits");

  // Fetch taste profile answers
  const profileQuery = supabase
    .from("taste_profiles")
    .select("answers")
    .eq("user_id", user.id);

  const { data: profileRow } = profileId
    ? await profileQuery.eq("id", profileId).single()
    : await profileQuery.order("created_at", { ascending: false }).limit(1).single();

  const quizAnswers =
    (profileRow?.answers as Record<string, string | string[]>) ?? {};

  // Fetch wardrobe items
  const { data: items, error: itemsError } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", user.id);

  if (itemsError) return { error: itemsError.message };
  if (!items || items.length === 0) {
    return {
      error:
        "Your wardrobe is empty. Add some items before generating an outfit.",
    };
  }

  try {
    const outfit = await generateOutfit(quizAnswers, items, user.id, anchorItemId, noOuterwear);
    return { outfit };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Generation failed." };
  }
}

export async function saveOutfitAction(
  outfit: GeneratedOutfit,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/outfits");

  const { error } = await supabase.from("past_outfits").insert({
    user_id: user.id,
    item_ids: outfit.selectedItemIds,
    rationale: outfit.rationale,
    occasion: outfit.occasion,
    fit_score: outfit.fitScore,
    styling_tips: outfit.stylingTips,
    color_story: outfit.colorStory,
  });

  if (error) return { error: error.message };

  revalidatePath("/outfits");
  return {};
}
