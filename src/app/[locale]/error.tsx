"use client";

import { textAction } from "@/components/chrome/styles";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import recovery from "@/lib/i18n/recovery.json";

/**
 * Next requires an error boundary to be a client component. This is the one sanctioned
 * `use client` in the app shell. It renders only after something has already failed, so
 * it is not part of the server-rendered content that check:ssr guards.
 *
 * It reads recovery.json rather than the message catalogues. Importing those here
 * would ship both languages in every page's JavaScript.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main
      id="main"
      className="mx-auto w-full px-4 py-12 max-w-[var(--portal-content-max)]"
    >
      <h1 className="text-title-l font-semibold">{recovery["error.title"]}</h1>
      <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
        {recovery["error.body"]}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-primary text-primary-foreground mt-6 inline-flex h-10 items-center rounded-lg px-4 text-body-compact font-medium"
      >
        {recovery["error.retry"]}
      </button>
      <a href={`/${DEFAULT_LOCALE}/cause-list`} className={`${textAction} mt-4`}>
        {recovery["nav.causeList"]}
      </a>
    </main>
  );
}
