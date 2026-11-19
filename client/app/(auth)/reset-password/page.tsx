"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { resetPassword } from "@/lib/api/auth";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
    setIsTokenReady(true);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ token, new_password: newPassword });
      setIsComplete(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not reset password. Request a new reset link and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full flex-1 items-start justify-center px-5 py-[var(--section-padding-y)]">
      <section
        aria-labelledby="reset-password-heading"
        className="w-full max-w-[440px] rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-6 sm:p-8"
      >
        <header className="mb-8">
          <h1
            id="reset-password-heading"
            className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]"
          >
            Create a new password
          </h1>
          <p className="mt-4 text-base leading-6 text-[var(--color-text-muted)]">
            Choose a new password for your account.
          </p>
        </header>

        {!isTokenReady ? null : !token ? (
          <div className="space-y-5">
            <p role="alert" className="text-sm text-red-700">
              This reset link is missing or invalid. Request a new one to continue.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] hover:bg-[var(--color-primary-hover)]"
            >
              Request a new reset link
            </Link>
          </div>
        ) : isComplete ? (
          <div className="space-y-5">
            <p role="status" className="text-sm text-green-800">
              Password updated successfully. You can now log in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] hover:bg-[var(--color-primary-hover)]"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-base font-medium">
                New password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-base font-medium">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
