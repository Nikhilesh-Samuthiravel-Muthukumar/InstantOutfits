import { redirect } from "next/navigation";
import { QuizFlow } from "~/components/quiz/quiz-flow";
import { createClient } from "~/lib/supabase/server";

export const metadata = {
  title: "Style Quiz — InstantOutfits",
};

export default async function QuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/wardrobe/quiz");

  return <QuizFlow />;
}
