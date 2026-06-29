import Link from "next/link";
import { LoginForm } from "~/components/auth/login-form";

export const metadata = {
  title: "Sign In — InstantOutfits",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Sign In
        </p>
        <h1 className="mb-8 text-4xl font-black uppercase leading-none tracking-tighter text-foreground">
          Welcome back.
        </h1>
        <LoginForm />
        <p className="mt-6 text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-foreground underline underline-offset-4 hover:opacity-75"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
