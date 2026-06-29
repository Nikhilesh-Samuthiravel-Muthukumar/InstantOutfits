import { ResetPasswordForm } from "~/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password — InstantOutfits",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Reset Password
        </p>
        <h1 className="mb-8 text-4xl font-black uppercase leading-none tracking-tighter text-foreground">
          New password.
        </h1>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
