"use server";

import { createClient } from "~/lib/supabase/server";

export async function resolveEmail(emailOrUsername: string): Promise<string> {
  const input = emailOrUsername.trim();
  if (input.includes("@")) return input;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("username", input)
    .single();

  if (!data) throw new Error("No account found with that username.");
  return data.email;
}

// Keep OTP as a fallback "magic link" option
export async function signInWithEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });
  if (error) throw new Error(error.message);
}
