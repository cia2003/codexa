"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SavedTranscription = {
  id: string;
  name: string;
  savedAt: string;
};

const savedTranscriptions: SavedTranscription[] = [];
const pageSize = 10;

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTranscriptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return savedTranscriptions
      .filter((transcription) =>
        transcription.name.toLocaleLowerCase().includes(query),
      )
      .sort((first, second) => {
        const dateDifference =
          new Date(first.savedAt).getTime() - new Date(second.savedAt).getTime();
        return sortOrder === "newest" ? -dateDifference : dateDifference;
      });
  }, [search, sortOrder]);

  const totalPages = Math.ceil(filteredTranscriptions.length / pageSize);
  const pageItems = filteredTranscriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const firstItem =
    filteredTranscriptions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(
    currentPage * pageSize,
    filteredTranscriptions.length,
  );

  function updateSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateSortOrder(value: "newest" | "oldest") {
    setSortOrder(value);
    setCurrentPage(1);
  }

  return (
    <main className="mx-auto w-full flex-1 px-5 py-[var(--section-padding-y)] min-[1440px]:px-[160px]">
      <div className="mx-auto w-full max-w-[1120px]">
        <header className="mb-8">
          <h1 className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]">
            History
          </h1>
          <p className="mt-4 text-lg leading-[var(--text-lg-line-height)] text-[var(--color-text-muted)]">
            Every transcriptions you save. Open to view or export it.
          </p>
        </header>

        <section aria-label="Search and filter history">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <label className="relative block">
              <span className="sr-only">Search transcriptions</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                <circle
                  cx="8.75"
                  cy="8.75"
                  r="5.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="m13 13 4 4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by name"
                className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white py-3 pl-11 pr-4 text-base placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </label>

            <label className="block">
              <span className="sr-only">Sort by saved date</span>
              <select
                value={sortOrder}
                onChange={(event) =>
                  updateSortOrder(
                    event.target.value === "oldest" ? "oldest" : "newest",
                  )
                }
                className="min-h-[var(--control-min-height)] w-full rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </section>

        <section
          aria-label="Saved transcriptions"
          className="overflow-hidden rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead className="bg-black/[.025]">
                <tr className="border-b border-[var(--color-border)]">
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]"
                  >
                    Saved
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-sm font-medium text-[var(--color-text-muted)]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {pageItems.length > 0 ? (
                  pageItems.map((transcription) => (
                    <tr key={transcription.id}>
                      <td className="max-w-[420px] truncate px-6 py-4 text-sm font-medium">
                        {transcription.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--color-text-muted)]">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(transcription.savedAt))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/history/${transcription.id}`}
                            className="inline-flex min-h-[var(--tap-target-min-size)] items-center text-sm font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex min-h-[var(--tap-target-min-size)] items-center text-sm font-medium text-[var(--color-primary)] underline underline-offset-4 hover:text-[var(--color-primary-hover)]"
                          >
                            Export PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]"
                    >
                      {search
                        ? "No transcriptions match your search."
                        : "No saved transcriptions yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--color-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              Showing {firstItem} of{" "}
              {filteredTranscriptions.length}
            </p>
            <nav aria-label="History pagination" className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="inline-flex min-h-[var(--tap-target-min-size)] items-center rounded-[var(--control-radius)] border border-[var(--color-border)] px-4 text-sm font-medium transition-colors hover:bg-black/[.03] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="inline-flex min-h-[var(--tap-target-min-size)] items-center rounded-[var(--control-radius)] border border-[var(--color-border)] px-4 text-sm font-medium transition-colors hover:bg-black/[.03] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}
