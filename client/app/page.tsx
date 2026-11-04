import Link from "next/link";

type RecentTranscription = {
  id: string;
  name: string;
  updatedAt: string;
};

const recentTranscriptions: RecentTranscription[] = [];

export default function Home() {
  return (
    <main className="mx-auto w-full flex-1 px-5 min-[1440px]:px-[160px]">
      <section
        aria-labelledby="home-heading"
        className="py-[var(--section-padding-y)]"
      >
        <div className="grid grid-cols-1 items-center gap-8 rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-4 sm:p-8 min-[768px]:grid-cols-2 min-[768px]:gap-12 min-[768px]:p-12">
          <div className="flex flex-col items-start">
            <p className="font-[var(--font-heading)] text-xl font-semibold text-[var(--color-primary)]">
              Welcome to Codexa
            </p>
            <h1
              id="home-heading"
              className="mt-4 max-w-[520px] font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]"
            >
              Turn a manuscript photo into text
            </h1>
            <p className="mt-4 max-w-[520px] text-lg leading-[var(--text-lg-line-height)] text-[var(--color-text-muted)]">
              Upload a page. The app finds each line and transcribes it. You
              check the result and save it.
            </p>
            <Link
              href="/transcription"
              className="mt-8 inline-flex min-h-[var(--control-min-height)] items-center justify-center gap-2 rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] transition-colors hover:bg-[var(--color-primary-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Start Transcribing
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M4.167 10h11.666m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </Link>
          </div>

          <div
            role="img"
            aria-label="Manuscript photo placeholder"
            className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[var(--control-radius)] border border-[var(--color-border)] bg-[#f1eee3] p-6 sm:p-8"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 360 260"
              fill="none"
              className="h-full w-full max-w-[360px]"
            >
              <rect
                x="37"
                y="24"
                width="286"
                height="212"
                rx="12"
                fill="#E3DDC5"
              />
              <path
                d="M122 47h116a10 10 0 0 1 10 10v148a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V61a14 14 0 0 1 10-14Z"
                fill="#FAF7EC"
                stroke="#C9C1A8"
                strokeWidth="2"
              />
              <path
                d="M136 83c28-8 51 9 81 0m-81 23c32-8 53 9 83 0m-83 23c27-8 50 9 80 0m-80 23c31-8 52 9 82 0m-82 23c23-7 45 7 70 1"
                stroke="#82906F"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <circle cx="266" cy="68" r="13" fill="#B8893B" fillOpacity=".25" />
            </svg>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="recent-transcriptions-heading"
        className="pb-[var(--section-padding-y)]"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2
            id="recent-transcriptions-heading"
            className="font-[var(--font-heading)] text-[length:var(--text-3xl)] leading-[var(--text-3xl-line-height)] font-semibold tracking-[-0.015em]"
          >
            Recent transcriptions
          </h2>
          <Link
            href="/history"
            className="inline-flex min-h-[var(--tap-target-min-size)] shrink-0 items-center text-base font-medium text-[var(--color-primary)] underline underline-offset-4 transition-colors hover:text-[var(--color-primary-hover)]"
          >
            View all
          </Link>
        </div>

        {recentTranscriptions.length > 0 ? (
          <ul className="divide-y divide-[var(--color-border)] rounded-[var(--control-radius)] border border-[var(--color-border)]">
            {recentTranscriptions.map((transcription) => (
              <li key={transcription.id}>
                <Link
                  href={`/transcription/${transcription.id}`}
                  className="flex min-h-[var(--tap-target-min-size)] items-center justify-between gap-4 rounded-[var(--control-radius)] px-4 py-4 transition-colors hover:bg-black/[.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:px-6"
                >
                  <span className="min-w-0 truncate font-medium">
                    {transcription.name}
                  </span>
                  <span className="shrink-0 text-sm text-[var(--color-text-muted)]">
                    Updated{" "}
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(transcription.updatedAt))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[var(--control-radius)] border border-[var(--color-border)] px-6 py-8 text-center text-base text-[var(--color-text-muted)]">
            No manuscript were transcribe
          </p>
        )}
      </section>
    </main>
  );
}
