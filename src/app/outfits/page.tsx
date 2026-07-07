import { redirect } from "next/navigation";
import type { SavedOutfit } from "~/app/outfits/actions";
import type { TasteProfile } from "~/app/wardrobe/quiz/actions";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";
import { OutfitGenerator } from "~/components/outfits/outfit-generator";
import { PastOutfitsList } from "~/components/outfits/past-outfits-list";
import { createClient } from "~/lib/supabase/server";

export const metadata = {
  title: "Outfits — InstantOutfits",
};

export default async function OutfitsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/outfits");

  // Fetch wardrobe items + signed URLs in one pass
  const { data: items } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = items ?? [];
  let wardrobeItems: WardrobeItemWithUrl[] = [];

  if (rows.length > 0) {
    const { data: signedData } = await supabase.storage
      .from("wardrobe-photos")
      .createSignedUrls(
        rows.map((i) => i.storage_path),
        3600,
      );
    const urlMap = new Map(
      (signedData ?? []).map((e) => [e.path, e.signedUrl]),
    );
    wardrobeItems = rows.map((item) => ({
      ...item,
      imageUrl: urlMap.get(item.storage_path) ?? null,
    }));
  }

  // Fetch taste profiles
  const { data: tasteProfiles } = await supabase
    .from("taste_profiles")
    .select("id, name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved outfits, newest first
  const { data: savedOutfits } = await supabase
    .from("past_outfits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <OutfitGenerator
          wardrobeItems={wardrobeItems}
          tasteProfiles={(tasteProfiles ?? []) as TasteProfile[]}
        />
        <PastOutfitsList
          outfits={(savedOutfits ?? []) as SavedOutfit[]}
          wardrobeItems={wardrobeItems}
        />
      </div>
    </main>
  );
}
