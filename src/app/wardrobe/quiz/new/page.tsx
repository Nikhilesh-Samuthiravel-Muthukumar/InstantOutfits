import { redirect } from "next/navigation";
import { QuizFlow } from "~/components/quiz/quiz-flow";
import { createClient } from "~/lib/supabase/server";

export const metadata = {
  title: "New Taste Profile — InstantOutfits",
};

export default async function NewQuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/wardrobe/quiz/new");

  return <QuizFlow />;
}
