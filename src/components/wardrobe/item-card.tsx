"use client";

import Image from "next/image";
import { useTransition } from "react";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";
import { deleteWardrobeItem } from "~/app/wardrobe/actions";
import { cn } from "~/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessories: "Accessories",
  bags: "Bags",
  other: "Other",
};

type Props = {
  item: WardrobeItemWithUrl;
};

export function ItemCard({ item }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteWardrobeItem(item.id);
    });
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col border border-border",
        isPending && "opacity-40 pointer-events-none",
      )}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name || CATEGORY_LABELS[item.category] || "Clothing item"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}

        {/* Delete button — appears on hover */}
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete item"
          className="absolute right-2 top-2 bg-background/90 px-2 py-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-white"
        >
          Remove
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-0.5 border-t border-border px-3 py-2.5">
        {item.name && (
          <p className="truncate text-sm font-medium leading-tight">
            {item.name}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{CATEGORY_LABELS[item.category] ?? item.category}</span>
          {item.color && (
            <>
              <span>·</span>
              <span className="truncate">{item.color}</span>
            </>
          )}
        </div>
        {item.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
