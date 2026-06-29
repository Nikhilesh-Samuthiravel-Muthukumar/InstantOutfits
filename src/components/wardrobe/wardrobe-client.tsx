"use client";

import { useState } from "react";
import type { WardrobeItemWithUrl } from "~/app/wardrobe/actions";
import { AddItemForm } from "~/components/wardrobe/add-item-form";
import { EmptyState } from "~/components/wardrobe/empty-state";
import { ItemCard } from "~/components/wardrobe/item-card";

type Props = {
  items: WardrobeItemWithUrl[];
};

export function WardrobeClient({ items }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Wardrobe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length === 0
              ? "No items yet"
              : `${items.length} ${items.length === 1 ? "item" : "items"}`}
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
          >
            Add Item
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {showForm && <AddItemForm onClose={() => setShowForm(false)} />}
    </>
  );
}
