import { PostHog } from "posthog-node";
import { env } from "~/env";

let client: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!client) {
    client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}
