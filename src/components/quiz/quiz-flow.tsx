"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveQuizResponse } from "~/app/wardrobe/quiz/actions";
import { cn } from "~/lib/utils";

type QuestionType = "single" | "multi";

interface Option {
  id: string;
  label: string;
}

interface Question {
  id: string;
  text: string;
  subtitle?: string;
  type: QuestionType;
  maxSelect?: number;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "fit",
    text: "What silhouettes feel most like you?",
    subtitle: "Pick up to 2.",
    type: "multi",
    maxSelect: 2,
    options: [
      { id: "oversized", label: "Oversized & relaxed" },
      { id: "slim", label: "Slim & fitted" },
      { id: "tailored", label: "Tailored & structured" },
      { id: "cropped", label: "Cropped & cut-off" },
      { id: "layered", label: "Layered & draped" },
    ],
  },
  {
    id: "colors",
    text: "Which color families do you reach for?",
    subtitle: "Pick up to 3.",
    type: "multi",
    maxSelect: 3,
    options: [
      { id: "neutrals", label: "Neutrals — white, grey, beige" },
      { id: "earth", label: "Earth tones — brown, rust, olive" },
      { id: "monochrome", label: "All black / monochrome" },
      { id: "bold", label: "Bold & saturated" },
      { id: "pastels", label: "Pastels & muted" },
      { id: "dark", label: "Dark & moody" },
    ],
  },
  {
    id: "occasions",
    text: "Where do you mostly get dressed for?",
    subtitle: "Pick up to 3.",
    type: "multi",
    maxSelect: 3,
    options: [
      { id: "casual", label: "Everyday casual" },
      { id: "streetwear", label: "Streetwear / going out" },
      { id: "work", label: "Work / office" },
      { id: "active", label: "Active / sport" },
      { id: "formal", label: "Events / formal" },
      { id: "creative", label: "Creative / art scene" },
    ],
  },
  {
    id: "aesthetics",
    text: "Pick the aesthetics that speak to you.",
    subtitle: "Pick up to 3.",
    type: "multi",
    maxSelect: 3,
    options: [
      { id: "minimalist", label: "Minimalist" },
      { id: "vintage", label: "Vintage / thrifted" },
      { id: "streetwear", label: "Streetwear / urban" },
      { id: "preppy", label: "Clean / preppy" },
      { id: "techwear", label: "Techwear / futuristic" },
      { id: "bohemian", label: "Bohemian / free-spirit" },
      { id: "edgy", label: "Edgy / dark" },
      { id: "classic", label: "Classic / timeless" },
    ],
  },
  {
    id: "patterns",
    text: "How do you feel about patterns?",
    type: "single",
    options: [
      { id: "solids", label: "Mostly solids" },
      { id: "subtle", label: "Occasional subtle patterns" },
      { id: "bold", label: "Love a bold pattern" },
    ],
  },
  {
    id: "wardrobe_style",
    text: "How do you build your wardrobe?",
    type: "single",
    options: [
      { id: "invest", label: "Invest in quality pieces" },
      { id: "mix", label: "Mix of high-street & basics" },
      { id: "thrift", label: "Thrift & vintage focused" },
      { id: "spontaneous", label: "Whatever catches my eye" },
    ],
  },
];

type Answers = Record<string, string | string[]>;

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = QUESTIONS[step];
  const total = QUESTIONS.length;
  const progressPct = (step / total) * 100;

  const currentAnswer = answers[question.id];
  const selectedIds: string[] = Array.isArray(currentAnswer)
    ? currentAnswer
    : currentAnswer
      ? [currentAnswer]
      : [];

  function toggleOption(id: string) {
    if (question.type === "single") {
      setAnswers((prev) => ({ ...prev, [question.id]: id }));
      return;
    }
    const max = question.maxSelect ?? 99;
    setAnswers((prev) => {
      const current = (prev[question.id] as string[] | undefined) ?? [];
      if (current.includes(id)) {
        return { ...prev, [question.id]: current.filter((x) => x !== id) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [question.id]: [...current, id] };
    });
  }

  function canAdvance() {
    const ans = answers[question.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  }

  function handleNext() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await saveQuizResponse(answers);
        setSubmitted(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          All done
        </p>
        <h2 className="text-5xl font-black uppercase leading-none tracking-tighter text-foreground">
          Style Quiz
          <br />
          Finished.
        </h2>
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
          We'll use your answers to build outfit recommendations from your
          wardrobe.
        </p>

        <div className="mt-12 w-full max-w-xs border border-border p-6 text-left">
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Next step
          </p>
          <h3 className="mb-2 text-xl font-black uppercase tracking-tighter text-foreground">
            Create a new taste profile.
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            Retake the quiz anytime to update your style preferences as your
            taste evolves.
          </p>
          <button
            type="button"
            className="bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-75"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setStep(0);
              router.refresh();
            }}
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col px-4 py-12">
      {/* Progress bar */}
      <div className="mb-14">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {String(step + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="relative h-px w-full bg-border">
          <div
            className="absolute inset-y-0 left-0 bg-foreground transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Question {step + 1}
        </p>
        <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
          {question.text}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">
            {question.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2">
          {question.options.map((opt) => {
            const selected = selectedIds.includes(opt.id);
            const maxed =
              !selected &&
              question.type === "multi" &&
              selectedIds.length >= (question.maxSelect ?? 99);

            return (
              <button
                key={opt.id}
                type="button"
                disabled={maxed}
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "flex items-center gap-4 border px-5 py-4 text-left text-sm transition-colors",
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground",
                  maxed && "cursor-not-allowed opacity-25",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] font-bold",
                    selected
                      ? "border-background text-background"
                      : "border-muted-foreground text-transparent",
                  )}
                >
                  ✓
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-xs text-destructive">{error}</p>}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance() || isPending}
          className={cn(
            "bg-foreground px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity",
            !canAdvance() || isPending
              ? "cursor-not-allowed opacity-30"
              : "hover:opacity-75",
          )}
        >
          {isPending ? "Saving…" : step === total - 1 ? "Submit" : "Next →"}
        </button>
      </div>
    </div>
  );
}
