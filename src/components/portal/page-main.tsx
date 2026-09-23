import { SiteChrome } from "@/components/chrome/site-chrome";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export function PageMain({
  locale,
  path,
  t,
  title,
  intro,
}: {
  locale: Locale;
  path: string;
  t: Messages;
  title: string;
  intro: string;
}) {
  return (
    <SiteChrome locale={locale} path={path} t={t}>
      <main id="main" className="mx-auto w-full max-w-[var(--portal-content-max)] px-4 py-12">
        <h1 className="text-title-l font-semibold">{title}</h1>
        <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">{intro}</p>
      </main>
    </SiteChrome>
  );
}
