"use client";

import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * Next requires an error boundary to be a client component — this is the one sanctioned
 * `use client` in the app shell. It renders only after something has already failed, so
 * it is not part of the server-rendered content that check:ssr guards.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = getMessages(DEFAULT_LOCALE);
  return (
    <main
      id="main"
      className="mx-auto w-full px-4 py-12 max-w-[var(--portal-content-max)]"
    >
      <h1 className="type-section">{t["error.title"]}</h1>
      <p className="type-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
        {t["error.body"]}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground mt-6 inline-flex h-10 items-center rounded-lg px-4 type-action"
      >
        {t["error.retry"]}
      </button>
    </main>
  );
}
