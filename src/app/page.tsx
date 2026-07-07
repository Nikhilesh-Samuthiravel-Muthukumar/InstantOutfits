import Image from "next/image";
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
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 3.5rem)" }}>
        {/* Scattered background photos */}

        {/* fit_3 — camo pants, BIG left side */}
        <div className="pointer-events-none absolute -left-8 top-0 h-full w-56 rotate-[-3deg] sm:w-72 md:w-96" style={{ outline: "2px solid white", outlineOffset: "-2px" }}>
          <Image
            src="/fit_3.JPG"
            alt="outfit"
            width={600}
            height={1200}
            className="h-full w-full object-cover object-top"
          />
        </div>

        {/* fit_2 — Key West, top-right */}
        <div className="pointer-events-none absolute -right-4 top-6 w-32 rotate-[7deg] sm:w-44 md:right-8 md:w-52" style={{ outline: "2px solid white", outlineOffset: "-2px" }}>
          <Image
            src="/fit_2.jpeg"
            alt="outfit"
            width={400}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* fit_4 — white tee night, bottom-right */}
        <div className="pointer-events-none absolute bottom-8 right-4 w-28 rotate-[-5deg] sm:w-40 md:right-12 md:w-48" style={{ outline: "2px solid white", outlineOffset: "-2px" }}>
          <Image
            src="/fit_4.jpeg"
            alt="outfit"
            width={400}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* fit_5 — brown thermal, mid-right */}
        <div className="pointer-events-none absolute right-12 top-1/2 w-24 -translate-y-1/2 rotate-[10deg] sm:w-36 md:right-48 md:w-44" style={{ outline: "2px solid white", outlineOffset: "-2px" }}>
          <Image
            src="/fit_5.jpeg"
            alt="outfit"
            width={400}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>

        {/* Graffiti SVG decorations */}

        {/* spray star top-left */}
        <svg className="pointer-events-none absolute left-[12%] top-[18%] w-16 rotate-[15deg] opacity-40 sm:w-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M50 5 L61 35 L95 35 L68 57 L79 91 L50 70 L21 91 L32 57 L5 35 L39 35 Z" fill="currentColor" className="text-foreground"/>
        </svg>

        {/* drip arrow top-right area */}
        <svg className="pointer-events-none absolute right-[22%] top-[12%] w-10 rotate-[-20deg] opacity-35 sm:w-14" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M20 0 L36 20 L26 20 L26 60 Q26 75 20 80 Q14 75 14 60 L14 20 L4 20 Z" fill="currentColor" className="text-foreground"/>
        </svg>

        {/* lightning bolt mid-left */}
        <svg className="pointer-events-none absolute left-[8%] top-[45%] w-12 rotate-[5deg] opacity-30 sm:w-16" viewBox="0 0 50 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M35 0 L10 50 L22 50 L15 90 L40 40 L28 40 Z" fill="currentColor" className="text-foreground"/>
        </svg>

        {/* scribble circle bottom-left area */}
        <svg className="pointer-events-none absolute left-[30%] bottom-[20%] w-20 rotate-[8deg] opacity-25 sm:w-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" strokeDasharray="8 5" className="text-foreground"/>
          <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" className="text-foreground"/>
        </svg>

        {/* X mark top-right */}
        <svg className="pointer-events-none absolute right-[10%] top-[30%] w-10 rotate-[20deg] opacity-30 sm:w-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 5 L55 55 M55 5 L5 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-foreground"/>
        </svg>

        {/* spray dots cluster top-center */}
        <svg className="pointer-events-none absolute left-[50%] top-[8%] w-24 -translate-x-1/2 opacity-20" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {[10,22,35,50,65,78,90,105].map((cx, i) => (
            <circle key={cx} cx={cx} cy={10 + (i % 3) * 10} r={2 + (i % 2)} fill="currentColor" className="text-foreground"/>
          ))}
        </svg>

        {/* tag text bottom-right */}
        <div className="pointer-events-none absolute bottom-[14%] right-[6%] rotate-[-12deg] font-black uppercase opacity-15 text-foreground" style={{ fontSize: "clamp(2rem,5vw,4rem)", letterSpacing: "-0.05em", WebkitTextStroke: "1px currentColor", color: "transparent" }}>
          DRIP
        </div>

        {/* tag text top-left */}
        <div className="pointer-events-none absolute left-[4%] top-[6%] rotate-[8deg] font-black uppercase opacity-15 text-foreground" style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", letterSpacing: "-0.05em", WebkitTextStroke: "1px currentColor", color: "transparent" }}>
          FIT
        </div>

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Center content */}
        <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
            AI-Powered Style Curation
          </p>

          {/* Big type */}
          <div className="relative">
            <h1 className="select-none text-[clamp(5rem,18vw,13rem)] font-black uppercase leading-[0.85] tracking-tighter text-foreground">
              INSTANT
            </h1>
            <h1 className="text-[clamp(5rem,18vw,13rem)] font-black uppercase leading-[0.85] tracking-tighter text-foreground">
              OUTFITS
            </h1>
          </div>

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
        </div>

        {/* Corner marks */}
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
