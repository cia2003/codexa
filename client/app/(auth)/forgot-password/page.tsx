"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await requestPasswordReset(
        String(formData.get("email") ?? "").trim(),
      );
      setMessage(response.message);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not request a password reset. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex w-full flex-1 items-start justify-center px-5 py-[var(--section-padding-y)]">
      <section
        aria-labelledby="forgot-password-heading"
        className="w-full max-w-[440px] rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-6 sm:p-8"
      >
        <header className="mb-8">
          <h1
            id="forgot-password-heading"
            className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]"
          >
            Forgot password?
          </h1>
          <p className="mt-4 text-base leading-6 text-[var(--color-text-muted)]">
            Enter your account email and we will send you a secure link to create a new password.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-base font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="text-sm text-green-800">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
          >
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
