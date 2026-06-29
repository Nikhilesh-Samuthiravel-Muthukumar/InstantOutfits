"use server";

import { createClient } from "~/lib/supabase/server";

export async function signIn(emailOrUsername: string, password: string) {
  const supabase = await createClient();
  let email = emailOrUsername.trim();

  if (!email.includes("@")) {
    const { data } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", email)
      .single();

    if (!data) throw new Error("No account found with that username.");
    email = data.email;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
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
