import { SiteFooter } from "@/components/chrome/site-footer";
import { SiteHeader } from "@/components/chrome/site-header";
import { SkipLink } from "@/components/chrome/skip-link";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { site } from "@/lib/site";

/**
 * The shared page chrome. Rendered by each page, which knows its own path,
 * rather than by the layout, which does not. See docs/ia.md.
 */
export function SiteChrome({
  locale,
  path,
  t,
  children,
}: {
  locale: Locale;
  path: string;
  t: Messages;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink label={t["nav.skip"]} />
      <SiteHeader locale={locale} path={path} t={t} />
      <div className="flex-1">{children}</div>
      <SiteFooter locale={locale} t={t} helpline={site.helpline} />
    </div>
  );
}
