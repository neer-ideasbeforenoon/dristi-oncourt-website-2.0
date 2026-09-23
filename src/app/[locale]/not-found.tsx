import { SiteChrome } from "@/components/chrome/site-chrome";
import { textAction } from "@/components/chrome/styles";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * A not-found page cannot read `params`, so it renders in the default locale. The
 * layout above it has already set `<html lang>` correctly for the requested locale.
 */
export default function NotFound() {
  const t = getMessages(DEFAULT_LOCALE);
  return (
    <SiteChrome locale={DEFAULT_LOCALE} path="" t={t}>
      <main
        id="main"
        className="mx-auto w-full max-w-[var(--portal-content-max)] px-4 py-12"
      >
        <h1 className="text-title-l font-semibold">{t["notFound.title"]}</h1>
        <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
          {t["notFound.body"]}
        </p>
        <a href={`/${DEFAULT_LOCALE}/cause-list`} className={`${textAction} mt-6`}>
          {t["nav.causeList"]}
        </a>
      </main>
    </SiteChrome>
  );
}
