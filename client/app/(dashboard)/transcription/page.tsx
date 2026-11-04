"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TranscriptionPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  function selectImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to continue.");
      return;
    }

    setError(null);
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  }

  return (
    <main className="mx-auto w-full flex-1 px-5 py-[var(--section-padding-y)] min-[1440px]:px-[160px]">
      <div className="mx-auto w-full max-w-[1120px]">
        <header className="mb-8">
          <h1 className="font-[var(--font-heading)] text-[length:var(--text-4xl)] leading-[var(--text-4xl-line-height)] font-semibold tracking-[-0.02em]">
            Transcribe a Manuscript
          </h1>
          <p className="mt-4 text-lg leading-[var(--text-lg-line-height)] text-[var(--color-text-muted)]">
            Add a photo of one page and review the result.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2 min-[768px]:gap-6">
          <section
            aria-labelledby="upload-heading"
            className="rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-4 sm:p-6"
          >
            <h2
              id="upload-heading"
              className="mb-4 font-[var(--font-heading)] text-[length:var(--text-2xl)] leading-[var(--text-2xl-line-height)] font-semibold tracking-[-0.01em]"
            >
              Upload a page
            </h2>
            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                if (event.target === event.currentTarget) {
                  setIsDragging(false);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                selectImage(event.dataTransfer.files[0]);
              }}
              className={`flex min-h-[280px] flex-col items-center justify-center rounded-[var(--control-radius)] border-2 border-dashed p-6 text-center transition-colors ${
                isDragging
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                  : "border-[var(--color-border)] bg-[var(--color-background)]"
              }`}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`Preview of ${imageFile?.name ?? "uploaded manuscript"}`}
                  width={400}
                  height={260}
                  unoptimized
                  className="mb-4 max-h-52 w-auto max-w-full rounded object-contain"
                />
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="mb-4 h-12 w-12 text-[var(--color-primary)]"
                >
                  <path
                    d="M24 31V11m0 0-7 7m7-7 7 7M11 29v7a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3v-7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
              <p className="font-medium">
                {imageFile ? imageFile.name : "Drag a photo here"}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                or
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => selectImage(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex min-h-[var(--control-min-height)] items-center justify-center rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white px-5 py-3 text-base font-medium text-[var(--color-text)] transition-colors hover:bg-black/[.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                Choose File
              </button>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                JPG, PNG, or another image format
              </p>
            </div>
            {error && (
              <p role="alert" className="mt-3 text-sm text-red-800">
                {error}
              </p>
            )}
          </section>

          <section
            aria-labelledby="transcriptions-heading"
            className="flex min-h-[360px] flex-col rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-4 sm:p-6"
          >
            <h2
              id="transcriptions-heading"
              className="font-[var(--font-heading)] text-[length:var(--text-2xl)] leading-[var(--text-2xl-line-height)] font-semibold tracking-[-0.01em]"
            >
              Transcriptions
            </h2>
            <div className="flex flex-1 items-center justify-center py-8 text-center">
              <p className="max-w-sm text-base leading-6 text-[var(--color-text-muted)]">
                No transcription available yet. Upload an image to begin.
              </p>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="translation-heading"
          className="mt-6 flex flex-col gap-4 rounded-[var(--control-radius)] border border-[var(--color-border)] bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div>
            <h2
              id="translation-heading"
              className="font-[var(--font-heading)] text-xl font-semibold"
            >
              English Translation
            </h2>
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
              Optional, shown here with the transcription.
            </p>
            {showTranslation && (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                Translation will appear here with the transcription.
              </p>
            )}
          </div>
          <button
            type="button"
            aria-pressed={showTranslation}
            onClick={() => setShowTranslation((visible) => !visible)}
            className="inline-flex min-h-[var(--control-min-height)] shrink-0 items-center justify-center rounded-[var(--control-radius)] border border-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </button>
        </section>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-start">
          <button
            type="button"
            disabled
            className="inline-flex min-h-[var(--control-min-height)] items-center justify-center rounded-[var(--control-radius)] bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-[var(--color-button-text)] opacity-50 disabled:cursor-not-allowed"
          >
            Save to History
          </button>
          <button
            type="button"
            disabled
            className="inline-flex min-h-[var(--control-min-height)] items-center justify-center rounded-[var(--control-radius)] border border-[var(--color-border)] px-5 py-3 text-base font-medium text-[var(--color-text)] opacity-50 disabled:cursor-not-allowed"
          >
            Export PDF
          </button>
        </div>
      </div>
    </main>
  );
}
