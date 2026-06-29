"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updatePassword } from "~/app/reset-password/actions";
import { cn } from "~/lib/utils";

const INPUT =
  "border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    startTransition(async () => {
      try {
        await updatePassword(password);
        router.push("/wardrobe");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const canSubmit = password && confirm && !isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          New Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirm"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Confirm Password
        </label>
        <input
          id="confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          className={INPUT}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "mt-1 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity",
          !canSubmit ? "cursor-not-allowed opacity-30" : "hover:opacity-75",
        )}
      >
        {isPending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}
