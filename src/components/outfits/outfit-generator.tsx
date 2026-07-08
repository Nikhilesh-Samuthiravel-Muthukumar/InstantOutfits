"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { generateOutfitAction, saveOutfitAction } from "~/app/outfits/actions";
import type { TasteProfile } from "~/app/wardrobe/quiz/actions";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";
import type { GeneratedOutfit } from "~/lib/ai/outfit-schema";
import { cn } from "~/lib/utils";

type Props = {
  wardrobeItems: WardrobeItemWithUrl[];
  tasteProfiles: TasteProfile[];
};

export function OutfitGenerator({ wardrobeItems, tasteProfiles }: Props) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    tasteProfiles[0]?.id ?? "",
  );
  const [anchorItemId, setAnchorItemId] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedOutfit | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, startGenerate] = useTransition();
  const [isSaving, startSave] = useTransition();

  const itemMap = new Map(wardrobeItems.map((i) => [i.id, i]));
  const selectedItems = generated?.selectedItemIds
    .map((id) => itemMap.get(id))
    .filter(Boolean) as WardrobeItemWithUrl[] | undefined;

  function handleGenerate() {
    setError(null);
    setSaved(false);
    setGenerated(null);
    startGenerate(async () => {
      const result = await generateOutfitAction(
        selectedProfileId || undefined,
        anchorItemId ?? undefined,
      );
      if (result.error) setError(result.error);
      else if (result.outfit) setGenerated(result.outfit);
    });
  }

  function handleSave() {
    if (!generated) return;
    startSave(async () => {
      const result = await saveOutfitAction(generated);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <section className="mb-16">
      {/* Header row */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Outfits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-generated looks from your wardrobe
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || tasteProfiles.length === 0}
          className={cn(
            "bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity",
            isGenerating || tasteProfiles.length === 0
              ? "cursor-not-allowed opacity-30"
              : "hover:opacity-75",
          )}
        >
          {isGenerating ? "Generating…" : "Generate Outfit"}
        </button>
      </div>

      {/* Taste profile selector */}
      {tasteProfiles.length > 0 ? (
        <div className="mb-8">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Taste Profile
          </p>
          <div className="flex flex-wrap gap-2">
            {tasteProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProfileId(p.id)}
                className={cn(
                  "border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors",
                  selectedProfileId === p.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8 border border-border p-5">
          <p className="text-sm text-muted-foreground">
            No taste profiles yet.{" "}
            <Link
              href="/wardrobe/quiz/new"
              className="text-foreground underline underline-offset-2"
            >
              Create one
            </Link>{" "}
            to generate outfits.
          </p>
        </div>
      )}

      {/* Anchor item picker */}
      {wardrobeItems.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Build Around (optional)
            </p>
            {anchorItemId && (
              <button
                type="button"
                onClick={() => setAnchorItemId(null)}
                className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {wardrobeItems.map((item) => {
              const isAnchor = anchorItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setAnchorItemId(isAnchor ? null : item.id)
                  }
                  className="flex w-20 shrink-0 flex-col gap-1.5 text-left"
                >
                  <div
                    className={cn(
                      "relative aspect-square w-full overflow-hidden bg-muted transition-all",
                      isAnchor
                        ? "outline outline-2 outline-foreground"
                        : "outline outline-1 outline-transparent hover:outline-border",
                    )}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name || item.category}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-muted-foreground">
                        No img
                      </div>
                    )}
                    {isAnchor && (
                      <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                        <span className="text-xs font-bold text-foreground">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="truncate text-[10px] capitalize text-muted-foreground">
                    {item.name || item.category}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      {/* Preview panel */}
      {generated && selectedItems && (
        <div className="border border-border p-6">
          {/* Selected items */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex w-28 shrink-0 flex-col gap-1">
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name || item.category}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <p className="truncate text-[11px] capitalize text-muted-foreground">
                  {item.name || item.category}
                </p>
              </div>
            ))}
          </div>

          {/* Metadata grid */}
          <div className="mb-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Occasion
              </p>
              <p className="text-sm font-medium capitalize">
                {generated.occasion}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Style Fit
              </p>
              <p className="text-sm font-medium">
                {generated.fitScore}
                <span className="text-muted-foreground">/10</span>
              </p>
            </div>
          </div>

          <div className="mb-4 space-y-3">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Stylist Rationale
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {generated.rationale}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Color Story
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {generated.colorStory}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Styling Tips
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {generated.stylingTips}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 border-t border-border pt-4">
            {saved ? (
              <p className="text-xs text-muted-foreground">
                Saved to past outfits.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={cn(
                  "bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity",
                  isSaving
                    ? "cursor-not-allowed opacity-30"
                    : "hover:opacity-75",
                )}
              >
                {isSaving ? "Saving…" : "Save Outfit"}
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
