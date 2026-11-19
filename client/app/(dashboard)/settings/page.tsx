"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  changePassword,
  clearAuthSession,
  deleteAccount,
  getStoredAuthUser,
  type AuthUser,
} from "@/lib/api/auth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const fieldClassName =
  "min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20";

export default function AccountSettingsPage() {
  const router = useRouter();
  const isAuthorized = useRequireAuth();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    const syncUser = () => setUser(getStoredAuthUser());
    syncUser();
    window.addEventListener("codexa-auth-change", syncUser);
    return () => window.removeEventListener("codexa-auth-change", syncUser);
  }, []);

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      form.reset();
      setPasswordMessage(response.message);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Could not change password.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleAccountDeletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeleteError("");
    const formData = new FormData(event.currentTarget);
    const confirmation = String(formData.get("deleteConfirmation") ?? "");
    const currentPassword = String(formData.get("deletePassword") ?? "");

    if (confirmation !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm account removal.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteAccount(currentPassword);
      clearAuthSession();
      router.replace("/");
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete account.",
      );
      setIsDeletingAccount(false);
    }
  }

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  if (!isAuthorized) return null;

  return (
    <main className="mx-auto w-full flex-1 px-5 py-[var(--section-padding-y)] min-[1440px]:px-[160px]">
      <div className="mx-auto w-full max-w-[880px]">
        <header className="mb-8">
          <h1 className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]">
            Account settings
          </h1>
          <p className="mt-4 text-lg leading-[var(--text-lg-line-height)] text-[var(--color-text-muted)]">
            Review your account details and manage account security.
          </p>
        </header>

        <div className="space-y-6">
          <section
            aria-labelledby="account-information-heading"
            className="rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-5 sm:p-6"
          >
            <h2
              id="account-information-heading"
              className="font-[var(--font-heading)] text-[length:var(--text-2xl)] leading-[var(--text-2xl-line-height)] font-semibold"
            >
              Account information
            </h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-[var(--color-text-muted)]">Name</dt>
                <dd className="mt-1 break-words font-medium">
                  {user?.display_name || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-[var(--color-text-muted)]">Email</dt>
                <dd className="mt-1 break-words font-medium">
                  {user?.email || "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section
            aria-labelledby="account-security-heading"
            className="rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-5 sm:p-6"
          >
            <h2
              id="account-security-heading"
              className="font-[var(--font-heading)] text-[length:var(--text-2xl)] leading-[var(--text-2xl-line-height)] font-semibold"
            >
              Account security
            </h2>
            <h3 className="mt-5 text-lg font-semibold">Change password</h3>
            <form className="mt-4 space-y-4" onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="current-password" className="mb-2 block text-sm font-medium">
                  Current password
                </label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={fieldClassName}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-medium">
                    New password
                  </label>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={fieldClassName}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium">
                    Confirm new password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className={fieldClassName}
                  />
                </div>
              </div>
              {passwordError && (
                <p role="alert" className="text-sm text-red-700">
                  {passwordError}
                </p>
              )}
              {passwordMessage && (
                <p role="status" className="text-sm text-green-800">
                  {passwordMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={isChangingPassword}
                className="inline-flex min-h-[var(--control-min-height)] items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-60"
              >
                {isChangingPassword ? "Updating password..." : "Update password"}
              </button>
            </form>
          </section>

          <section
            aria-labelledby="logout-heading"
            className="flex flex-col gap-4 rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div>
              <h2 id="logout-heading" className="text-lg font-semibold">
                Sign out
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Sign out of this account on this device.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-[var(--control-min-height)] shrink-0 items-center justify-center rounded-[var(--control-radius)] border border-[var(--color-border)] px-5 py-3 text-base font-medium transition-colors hover:bg-black/[.03]"
            >
              Log out
            </button>
          </section>

          <section
            aria-labelledby="delete-account-heading"
            className="rounded-[var(--control-radius)] border border-red-200 bg-white/50 p-5 sm:p-6"
          >
            <h2 id="delete-account-heading" className="text-lg font-semibold text-red-800">
              Delete account
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              This permanently deletes your account and its saved transcriptions and uploaded pages.
            </p>
            <form className="mt-5 space-y-4" onSubmit={handleAccountDeletion}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="delete-password" className="mb-2 block text-sm font-medium">
                    Confirm with your password
                  </label>
                  <input
                    id="delete-password"
                    name="deletePassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={fieldClassName}
                  />
                </div>
                <div>
                  <label htmlFor="delete-confirmation" className="mb-2 block text-sm font-medium">
                    Type DELETE to continue
                  </label>
                  <input
                    id="delete-confirmation"
                    name="deleteConfirmation"
                    type="text"
                    autoComplete="off"
                    required
                    className={fieldClassName}
                  />
                </div>
              </div>
              {deleteError && (
                <p role="alert" className="text-sm text-red-700">
                  {deleteError}
                </p>
              )}
              <button
                type="submit"
                disabled={isDeletingAccount}
                className="inline-flex min-h-[var(--control-min-height)] items-center justify-center rounded-[var(--control-radius)] bg-red-700 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-60"
              >
                {isDeletingAccount ? "Deleting account..." : "Delete account permanently"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
