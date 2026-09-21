"use client";

import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

import "./app.css";

/**
 * Replaces the root layout when something throws above `[locale]`. Next requires
 * this file to define its own `<html>` and `<body>`, so language and content have
 * to live here, not in a parent.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  const t = getMessages(DEFAULT_LOCALE);
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]}>
      <body className="bg-background text-foreground font-sans antialiased">
        <main
          id="main"
          className="mx-auto w-full px-4 py-12 max-w-[var(--portal-content-max)]"
        >
          <h1 className="text-title-l font-semibold">{t["error.title"]}</h1>
          <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
            {t["error.body"]}
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground mt-6 inline-flex h-10 items-center rounded-lg px-4 text-body-compact font-medium"
          >
            {t["error.retry"]}
          </button>
        </main>
      </body>
    </html>
  );
}
