"use server";

import { env } from "~/env";
import { createClient } from "~/lib/supabase/server";

export async function sendPasswordReset(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });
  if (error) throw new Error(error.message);
}
