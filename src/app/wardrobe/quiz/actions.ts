"use server";

import { createClient } from "~/lib/supabase/server";

export async function saveQuizResponse(
  answers: Record<string, string | string[]>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("style_quiz_responses").upsert(
    {
      user_id: user.id,
      answers,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);
}
