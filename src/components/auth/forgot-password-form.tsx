"use client";

import { useState, useTransition } from "react";
import { sendPasswordReset } from "~/app/forgot-password/actions";
import { cn } from "~/lib/utils";

const INPUT =
  "border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await sendPasswordReset(email);
        setSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-foreground">Check your inbox.</p>
        <p className="text-sm text-muted-foreground">
          We sent a reset link to{" "}
          <span className="text-foreground">{email}</span>. It may take a minute
          to arrive.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={INPUT}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={!email || isPending}
        className={cn(
          "mt-1 bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity",
          !email || isPending
            ? "cursor-not-allowed opacity-30"
            : "hover:opacity-75",
        )}
      >
        {isPending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
