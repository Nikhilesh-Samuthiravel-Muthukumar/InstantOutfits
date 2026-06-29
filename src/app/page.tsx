import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Take the Quiz",
    desc: "Answer a few questions about your skin tone and personal style. Takes under 3 minutes.",
  },
  {
    num: "02",
    title: "Upload Your Clothes",
    desc: "Photograph your wardrobe items and upload them. We organize everything automatically.",
  },
  {
    num: "03",
    title: "Get Daily Outfits",
    desc: "Receive outfit suggestions tailored to your style and what you already own.",
  },
];

const features = [
  {
    title: "Skin Tone Analysis",
    desc: "We match colors that complement your complexion so every outfit looks intentional.",
  },
  {
    title: "Style Profile",
    desc: "From streetwear to minimalism — your taste profile shapes every recommendation.",
  },
  {
    title: "Digital Wardrobe",
    desc: "Upload photos of your clothes and browse your closet from anywhere.",
  },
  {
    title: "Daily Picks",
    desc: "Fresh outfit suggestions every morning based on your style and what you have.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          AI-Powered Style Curation
        </p>
        <h1 className="text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.9] tracking-tighter text-foreground">
          Instant
          <br />
          Outfits
        </h1>
        <p className="mt-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Upload your wardrobe. Take the style quiz.
          <br />
          Get dressed effortlessly, every day.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/wardrobe/quiz"
            className="bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
          >
            Start the Quiz
          </Link>
          <a
            href="#how-it-works"
            className="border border-border px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-foreground"
          >
            How It Works
          </a>
        </div>

        {/* Decorative corner lines */}
        <div className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-border" />
        <div className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-border" />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-16 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            The Process
          </p>
          <div className="grid gap-12 sm:grid-cols-3">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col gap-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {num}
                </span>
                <div className="h-px w-8 bg-border" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we analyze */}
      <section className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-16 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            What We Analyze
          </p>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {features.map(({ title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 bg-background p-8"
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border px-4 py-32 text-center">
        <div className="mx-auto max-w-xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Ready?
          </p>
          <h2 className="mb-8 text-5xl font-black uppercase leading-none tracking-tighter text-foreground">
            Get Dressed.
          </h2>
          <p className="mb-10 text-sm text-muted-foreground">
            Takes 3 minutes. Works with any wardrobe.
          </p>
          <Link
            href="/wardrobe/quiz"
            className="inline-block bg-foreground px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
          >
            Start the Quiz
          </Link>
        </div>
      </section>
    </main>
  );
}
