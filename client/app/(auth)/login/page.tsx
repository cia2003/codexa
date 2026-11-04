import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full flex-1 items-start justify-center px-5 py-[var(--section-padding-y)]">
      <section
        aria-labelledby="login-heading"
        className="w-full max-w-[440px] rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-6 sm:p-8"
      >
        <header className="mb-8">
          <h1
            id="login-heading"
            className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]"
          >
            Login
          </h1>
          <p className="mt-4 text-base leading-6 text-[var(--color-text-muted)]">
            with your email account to open your saved transcriptions.
          </p>
        </header>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-base font-medium"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-base font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <div className="mt-3 flex justify-end">
              <Link
                href="/forgot-password"
                className="inline-flex min-h-[var(--tap-target-min-size)] items-center text-sm font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Did not have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
