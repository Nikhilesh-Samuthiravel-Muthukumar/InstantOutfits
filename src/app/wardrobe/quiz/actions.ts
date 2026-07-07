"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";

export type TasteProfile = {
  id: string;
  user_id: string;
  name: string;
  answers: Record<string, string | string[]>;
  created_at: string;
};

export async function getTasteProfiles(): Promise<TasteProfile[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/wardrobe/quiz");

  const { data } = await supabase
    .from("taste_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as TasteProfile[];
}

export async function createTasteProfile(
  name: string,
  answers: Record<string, string | string[]>,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/wardrobe/quiz");

  const { error } = await supabase.from("taste_profiles").insert({
    user_id: user.id,
    name: name.trim() || "My Style",
    answers,
  });

  if (error) return { error: error.message };
  revalidatePath("/wardrobe/quiz");
  return {};
}

export async function deleteTasteProfile(
  id: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/wardrobe/quiz");

  const { error } = await supabase
    .from("taste_profiles")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/wardrobe/quiz");
  return {};
}
