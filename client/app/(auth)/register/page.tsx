import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full flex-1 items-start justify-center px-5 py-[var(--section-padding-y)]">
      <section
        aria-labelledby="register-heading"
        className="w-full max-w-[440px] rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-6 sm:p-8"
      >
        <header className="mb-8">
          <h1
            id="register-heading"
            className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]"
          >
            Register
          </h1>
          <p className="mt-4 text-base leading-6 text-[var(--color-text-muted)]">
            an account saves your transcriptions so you can open them again.
          </p>
        </header>

        <form className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-base font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

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
              autoComplete="new-password"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-base font-medium"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <button
            type="button"
            className="inline-flex min-h-[var(--control-min-height)] w-full items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
