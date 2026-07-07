# PostHog Setup Report

## Task 1 — PostHog Basics (Next.js App Router)

### What was done

- Installed `posthog-js`
- Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `src/env.ts` (validated via `@t3-oss/env-nextjs`)
- Created `src/app/posthog-provider.tsx` — client component that initialises `posthog-js` and wraps children with `PostHogProvider`
- Updated `src/app/layout.tsx` to wrap the app in `<PostHogProvider>`

### Config

| Setting | Value |
|---|---|
| `capture_pageview` | `"history_change"` (tracks every client-side route change) |
| `capture_pageleave` | `true` |

### Env vars added to `.env.local`

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST` → `https://us.i.posthog.com`

---

## Task 2 — LLM Analytics

### What was done

- Installed `posthog-node` and `@posthog/ai`
- Created `src/lib/posthog/server.ts` — singleton `PostHog` (Node) client reusing the existing public env vars
- Instrumented `src/lib/ai/generate-outfit.ts` to capture a `$ai_generation` event after every outfit generation call
- Updated `src/app/outfits/actions.ts` to pass the authenticated `user.id` as `distinctId`

### Event captured: `$ai_generation`

| Property | Source |
|---|---|
| `$ai_provider` | `"anthropic"` |
| `$ai_model` | `"claude-haiku-4-5-20251001"` |
| `$ai_input_tokens` | `usage.inputTokens` from Vercel AI SDK |
| `$ai_output_tokens` | `usage.outputTokens` from Vercel AI SDK |
| `$ai_latency` | wall-clock seconds for the `generateObject` call |

The `distinctId` is the Supabase `user.id`, so LLM events are linked to the same identity as product analytics events.

### Notes

- `@posthog/ai`'s `withTracing` wrapper was incompatible with the project's AI SDK v7 (`LanguageModelV4` vs `LanguageModelV2`), so events are captured manually via `posthog-node` using the AI SDK's `usage` return value.
- The `PostHog` Node client is configured with `flushAt: 1` and `flushInterval: 0` so events are flushed immediately within the server action (no buffering in a serverless context).
