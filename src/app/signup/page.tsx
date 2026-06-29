import Link from "next/link";
import { SignupForm } from "~/components/auth/signup-form";

export const metadata = {
  title: "Create Account — InstantOutfits",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          New Account
        </p>
        <h1 className="mb-8 text-4xl font-black uppercase leading-none tracking-tighter text-foreground">
          Get Started.
        </h1>
        <SignupForm />
        <p className="mt-6 text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4 hover:opacity-75"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
