import Link from "next/link";
import { redirect } from "next/navigation";
import { getTasteProfiles } from "~/app/wardrobe/quiz/actions";
import { ProfileList } from "~/components/quiz/profile-list";
import { createClient } from "~/lib/supabase/server";

export const metadata = {
  title: "Taste Profiles — InstantOutfits",
};

export default async function QuizPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/wardrobe/quiz");

  const profiles = await getTasteProfiles();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Your style identities
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
              Taste Profiles
            </h1>
          </div>
          <Link
            href="/wardrobe/quiz/new"
            className="bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
          >
            + New Profile
          </Link>
        </div>

        <ProfileList profiles={profiles} />
      </div>
    </main>
  );
}
