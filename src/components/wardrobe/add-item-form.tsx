"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { addWardrobeItem, type WardrobeCategory } from "~/app/wardrobe/actions";
import { cn } from "~/lib/utils";

const CATEGORIES: { value: WardrobeCategory; label: string }[] = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "bags", label: "Bags" },
  { value: "other", label: "Other" },
];

const INPUT_CLASS =
  "w-full border border-border bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none";

type Props = {
  onClose: () => void;
};

export function AddItemForm({ onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addWardrobeItem(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop — button so click-outside is accessible */}
      <button
        type="button"
        className="absolute inset-0 bg-background/80"
        onClick={onClose}
        aria-label="Close dialog"
        tabIndex={-1}
      />
      {/* Panel */}
      <div className="relative z-10 flex max-h-[90dvh] w-full max-w-md flex-col border border-border bg-background sm:mx-4">
        {/* Header — sticky */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em]">
            Add Item
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-6 py-5"
        >
          {/* Photo upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp,image/heic"
              className="sr-only"
              onChange={handleFileChange}
              required
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative flex w-full items-center justify-center border border-dashed border-border bg-muted/40 transition-colors hover:border-foreground"
              style={{ aspectRatio: "4/3" }}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Click to upload photo
                </span>
              )}
            </button>
          </div>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name (optional)"
            className={INPUT_CLASS}
          />

          {/* Category */}
          <select
            name="category"
            required
            defaultValue=""
            className={cn(INPUT_CLASS, "cursor-pointer")}
          >
            <option value="" disabled>
              Category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Color */}
          <input
            type="text"
            name="color"
            placeholder="Color (e.g. navy blue)"
            className={INPUT_CLASS}
          />

          {/* Tags */}
          <input
            type="text"
            name="tags"
            placeholder="Tags, comma-separated (e.g. casual, summer)"
            className={INPUT_CLASS}
          />

          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            rows={2}
            className={cn(INPUT_CLASS, "resize-none")}
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75",
              isPending && "cursor-not-allowed opacity-30",
            )}
          >
            {isPending ? "Saving…" : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
