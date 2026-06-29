"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { signIn } from "~/app/login/actions";
import { cn } from "~/lib/utils";

const INPUT =
  "border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none";

export function LoginForm() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await signIn(emailOrUsername, password);
        router.push("/wardrobe/quiz");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const canSubmit = emailOrUsername && password && !isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="emailOrUsername"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Email or username
        </label>
        <input
          id="emailOrUsername"
          type="text"
          required
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder="you@example.com or @username"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
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
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
