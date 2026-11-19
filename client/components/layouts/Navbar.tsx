"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  clearAuthSession,
  getStoredAuthUser,
  type AuthUser,
} from "@/lib/api/auth";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary-hover)]";

export default function Navbar() {
  const pathname = usePathname();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncAuthUser = () => setUser(getStoredAuthUser());
    syncAuthUser();
    window.addEventListener("storage", syncAuthUser);
    window.addEventListener("codexa-auth-change", syncAuthUser);

    return () => {
      window.removeEventListener("storage", syncAuthUser);
      window.removeEventListener("codexa-auth-change", syncAuthUser);
    };
  }, []);

  function handleLogout() {
    clearAuthSession();
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
  }

  if (
    pathname &&
    ["/login", "/register", "/forgot-password", "/reset-password"].includes(pathname)
  ) {
    return null;
  }

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-background)] sticky top-0 z-10 bg-[var(--color-background)] backdrop-blur-[var(--blur-amount)]">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between px-5 min-[1440px]:px-[160px]">
        <div className="flex min-w-0 items-center gap-8">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="shrink-0 font-[var(--font-heading)] text-xl font-semibold text-[var(--color-text)]"
          >
            Codexa
          </Link>

          <div className="flex items-center gap-1 max-[649px]:hidden">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href={user ? "/transcription" : "/login"} className={navLinkClass}>
              Transcribe
            </Link>
            <Link href={user ? "/history" : "/login"} className={navLinkClass}>
              History
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative ml-4 shrink-0 max-[649px]:hidden">
              <button
                type="button"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                aria-label="Account settings"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-[var(--color-text)] hover:bg-black/5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-[var(--color-text-muted)]"
                >
                  <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M5.5 19c.6-3.1 2.9-4.75 6.5-4.75s5.9 1.65 6.5 4.75"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.7"
                  />
                </svg>
                <span className="max-w-48 truncate">{user.email}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`h-4 w-4 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-10 mt-2 min-w-40 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1 shadow-lg"
                >
                  <Link
                    href="/settings"
                    role="menuitem"
                    className="block rounded-md px-3 py-2 text-sm text-[var(--color-text)] hover:bg-black/5"
                  >
                    Account settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-black/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-4 flex shrink-0 items-center gap-2 text-sm max-[649px]:hidden">
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-[var(--control-radius)] bg-[var(--color-primary)] px-4 py-2 font-medium text-[var(--color-button-text)] hover:bg-[var(--color-primary-hover)]"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="hidden h-11 w-11 items-center justify-center rounded-md text-[var(--color-text)] hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] max-[649px]:inline-flex"
          >
            {isMobileMenuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation-menu"
        className={`${isMobileMenuOpen ? "block" : "hidden"} absolute left-0 right-0 top-full border-b border-[var(--color-border)] bg-[var(--color-background)] px-5 py-3 shadow-md min-[650px]:hidden`}
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Home
          </Link>
          <Link
            href={user ? "/transcription" : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Transcribe
          </Link>
          <Link
            href={user ? "/history" : "/login"}
            onClick={() => setIsMobileMenuOpen(false)}
            className={navLinkClass}
          >
            History
          </Link>

          {user ? (
            <>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClass}
              >
                Account settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={`${navLinkClass} text-left`}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="mt-2 flex gap-3 border-t border-[var(--color-border)] pt-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-[var(--color-primary)]"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex min-h-11 items-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-button-text)]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
