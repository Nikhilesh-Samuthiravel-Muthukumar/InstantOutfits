import Image from "next/image";
import type { SavedOutfit } from "~/app/outfits/actions";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";

type Props = {
  outfits: SavedOutfit[];
  wardrobeItems: WardrobeItemWithUrl[];
};

export function PastOutfitsList({ outfits, wardrobeItems }: Props) {
  const itemMap = new Map(wardrobeItems.map((i) => [i.id, i]));

  if (outfits.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
          Past Outfits
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate and save an outfit to see it here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.2em]">
        Past Outfits
      </h2>
      <div className="flex flex-col gap-6">
        {outfits.map((outfit) => {
          const items = outfit.item_ids
            .map((id) => itemMap.get(id))
            .filter(Boolean) as WardrobeItemWithUrl[];

          const date = new Date(outfit.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <div key={outfit.id} className="border border-border p-5">
              {/* Item thumbnails */}
              <div className="mb-4 flex gap-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-16 w-16 shrink-0 overflow-hidden bg-muted"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name || item.category}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                <span>{outfit.occasion}</span>
                <span>·</span>
                <span>{outfit.fit_score}/10</span>
                <span>·</span>
                <span>{date}</span>
              </div>

              <p className="text-sm leading-relaxed text-foreground">
                {outfit.rationale}
              </p>

              {outfit.styling_tips && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {outfit.styling_tips}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
