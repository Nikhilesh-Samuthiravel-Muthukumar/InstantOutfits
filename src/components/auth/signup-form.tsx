"use client";

import { useState, useTransition } from "react";
import { signUpWithEmail } from "~/app/signup/actions";
import { cn } from "~/lib/utils";

const INPUT =
  "border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError(
        "Username must be 3–20 characters and contain only letters, numbers, or underscores.",
      );
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await signUpWithEmail(email, password, username);
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (done) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">
          Check your email.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="text-foreground">{email}</span>. Click it to activate
          your account and start your style quiz.
        </p>
      </div>
    );
  }

  const canSubmit = email && username && password && confirm && !isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Email address
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

      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. streetwear_nik"
          maxLength={20}
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
          placeholder="Min. 8 characters"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirm"
          className="text-xs uppercase tracking-widest text-muted-foreground"
        >
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Re-enter password"
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
        {isPending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
