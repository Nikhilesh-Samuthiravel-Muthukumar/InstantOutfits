import Link from "next/link";
import { ForgotPasswordForm } from "~/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password — InstantOutfits",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Forgot Password
        </p>
        <h1 className="mb-2 text-4xl font-black uppercase leading-none tracking-tighter text-foreground">
          Reset it.
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <ForgotPasswordForm />
        <p className="mt-6 text-xs text-muted-foreground">
          Remember it?{" "}
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
