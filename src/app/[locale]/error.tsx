"use client";

import { useParams } from "next/navigation";

import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import en from "@/messages/error/en.json";
import ml from "@/messages/error/ml.json";

const MESSAGES = { en, ml } as const;

/**
 * Next requires an error boundary to be a client component — this is the one sanctioned
 * `use client` in the app shell. It renders only after something has already failed, so
 * it is not part of the server-rendered content that check:ssr guards.
 *
 * It reads its own three-string catalogue in src/messages/error/, never the full site
 * catalogue: anything this file imports ships to every reader's browser.
 */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const t = MESSAGES[isLocale(locale) ? locale : DEFAULT_LOCALE];
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
