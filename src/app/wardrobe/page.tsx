import { redirect } from "next/navigation";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";
import { WardrobeClient } from "~/components/wardrobe/wardrobe-client";
import { createClient } from "~/lib/supabase/server";

export const metadata = {
  title: "Wardrobe — InstantOutfits",
};

export default async function WardrobePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/wardrobe");

  const { data: items } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = items ?? [];

  let itemsWithUrls: WardrobeItemWithUrl[] = [];

  if (rows.length > 0) {
    const { data: signedData } = await supabase.storage
      .from("wardrobe-photos")
      .createSignedUrls(
        rows.map((i) => i.storage_path),
        3600,
      );

    const urlMap = new Map(
      (signedData ?? []).map((entry) => [entry.path, entry.signedUrl]),
    );

    itemsWithUrls = rows.map((item) => ({
      ...item,
      imageUrl: urlMap.get(item.storage_path) ?? null,
    }));
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <WardrobeClient items={itemsWithUrls} />
      </div>
    </main>
  );
}
