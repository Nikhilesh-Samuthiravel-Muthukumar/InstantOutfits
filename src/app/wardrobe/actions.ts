"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";

export type WardrobeCategory =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "shoes"
  | "accessories"
  | "bags"
  | "other";

export type WardrobeItem = {
  id: string;
  user_id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  tags: string[];
  notes: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
};

export type WardrobeItemWithUrl = WardrobeItem & { imageUrl: string | null };

export async function addWardrobeItem(
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/wardrobe");

  const file = formData.get("photo") as File | null;
  const name = (formData.get("name") as string) ?? "";
  const category = (formData.get("category") as WardrobeCategory) ?? "other";
  const color = (formData.get("color") as string) ?? "";
  const tagsRaw = (formData.get("tags") as string) ?? "";
  const notes = (formData.get("notes") as string) ?? "";

  if (!file || file.size === 0) {
    return { error: "A photo is required." };
  }

  if (
    ![
      "tops",
      "bottoms",
      "outerwear",
      "shoes",
      "accessories",
      "bags",
      "other",
    ].includes(category)
  ) {
    return { error: "Invalid category." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const itemId = crypto.randomUUID();
  const storagePath = `${user.id}/${itemId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("wardrobe-photos")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error: insertError } = await supabase.from("wardrobe_items").insert({
    id: itemId,
    user_id: user.id,
    name,
    category,
    color,
    tags,
    notes,
    storage_path: storagePath,
  });

  if (insertError) {
    await supabase.storage.from("wardrobe-photos").remove([storagePath]);
    return { error: `Failed to save item: ${insertError.message}` };
  }

  revalidatePath("/wardrobe");
  return {};
}

export async function deleteWardrobeItem(
  itemId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/wardrobe");

  const { data: item, error: fetchError } = await supabase
    .from("wardrobe_items")
    .select("storage_path")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !item) {
    return { error: "Item not found." };
  }

  await supabase.storage.from("wardrobe-photos").remove([item.storage_path]);

  const { error: deleteError } = await supabase
    .from("wardrobe_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (deleteError) {
    return { error: `Failed to delete: ${deleteError.message}` };
  }

  revalidatePath("/wardrobe");
  return {};
}
