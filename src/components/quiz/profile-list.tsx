"use client";

import { useState, useTransition } from "react";
import { deleteTasteProfile } from "~/app/wardrobe/quiz/actions";
import type { TasteProfile } from "~/app/wardrobe/quiz/actions";
import { cn } from "~/lib/utils";

type Props = {
  profiles: TasteProfile[];
};

export function ProfileList({ profiles }: Props) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (profiles.length === 0) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-foreground">
          No profiles yet
        </p>
        <p className="text-xs text-muted-foreground">
          Create your first taste profile to start generating outfits.
        </p>
      </div>
    );
  }

  function handleDelete(id: string) {
    setDeleting(id);
    startTransition(async () => {
      await deleteTasteProfile(id);
      setDeleting(null);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between border border-border p-5"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-foreground">
              {profile.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Created{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(profile.id)}
            disabled={isPending && deleting === profile.id}
            className={cn(
              "text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-destructive",
              isPending && deleting === profile.id && "opacity-50",
            )}
          >
            {isPending && deleting === profile.id ? "Removing…" : "Remove"}
          </button>
        </div>
      ))}
    </div>
  );
}
