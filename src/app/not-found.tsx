import { portalFontVariables } from "@/app/fonts";
import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * Root 404. Hits that never enter `[locale]` never get that layout's `<html lang>`,
 * so this page has to ship language and content itself. The locale 404 is
 * `src/app/[locale]/not-found.tsx`.
 */
export default function RootNotFound() {
  const t = getMessages(DEFAULT_LOCALE);
  return (
    <html lang={HTML_LANG[DEFAULT_LOCALE]} className={portalFontVariables}>
      <body className="bg-background text-foreground font-sans antialiased">
        <main
          id="main"
          className="mx-auto w-full px-4 py-12 max-w-[var(--portal-content-max)]"
        >
          <h1 className="type-section">{t["notFound.title"]}</h1>
          <p className="type-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
            {t["notFound.body"]}
          </p>
        </main>
      </body>
    </html>
  );
}
