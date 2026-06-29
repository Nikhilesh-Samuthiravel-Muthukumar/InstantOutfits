"use server";

import { headers } from "next/headers";
import { createClient } from "~/lib/supabase/server";

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string,
) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${origin}/auth/callback?next=/wardrobe/quiz`,
    },
  });

  if (error) throw new Error(error.message);
}
