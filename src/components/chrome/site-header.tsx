import { focusRing, navLink } from "@/components/chrome/styles";
import { HTML_LANG, LOCALE_LABEL, LOCALES, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { PRIMARY_NAV } from "@/lib/navigation";
import { helplineHref, loginHref, site } from "@/lib/site";

/**
 * Identity, language, helpline, and the service navigation.
 *
 * Server-rendered on purpose. The current path is an argument from the page,
 * so a language switch keeps that page and the current item can be marked,
 * without a client component. A client header put every route over the
 * JavaScript budget.
 */
export function SiteHeader({
  locale,
  path,
  t,
}: {
  locale: Locale;
  /** Path after the locale, "" on the homepage. */
  path: string;
  t: Messages;
}) {
  const phone = helplineHref(site.helpline);
  const signIn = loginHref(locale);

  function withLocale(next: Locale): string {
    return path ? `/${next}${path}` : `/${next}`;
  }

  return (
    <header className="border-border bg-background border-b">
      <div className="border-border border-b">
        <div className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-wrap items-center justify-end gap-2 px-4 py-2">
          {phone && site.helpline ? (
            <a href={phone} className={navLink}>
              {t["home.helpline.heading"]}
              <span className="text-muted-foreground ms-2">{site.helpline}</span>
            </a>
          ) : null}
          <nav aria-label={t["lang.switch"]} className="flex flex-wrap items-center gap-1">
            {LOCALES.map((code) => {
              const current = code === locale;
              const label = LOCALE_LABEL[code];
              const hrefLang = HTML_LANG[code];
              if (current) {
                return (
                  <span
                    key={code}
                    aria-current="true"
                    lang={hrefLang}
                    className="bg-accent-strong inline-flex h-10 items-center rounded-lg px-3 text-body-compact font-medium"
                  >
                    {label}
                  </span>
                );
              }
              return (
                <a
                  key={code}
                  href={withLocale(code)}
                  hrefLang={hrefLang}
                  lang={hrefLang}
                  className={`${navLink} hover:bg-accent`}
                >
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-col gap-4 px-4 py-4">
        <div className="max-w-[var(--portal-measure)]">
          <a
            href={`/${locale}`}
            className={`inline-flex h-10 items-center rounded-lg text-title-s font-semibold ${focusRing}`}
          >
            {t["site.name"]}
          </a>
          <p className="text-body text-muted-foreground mt-1">{t["site.tagline"]}</p>
        </div>
        <nav aria-label={t["nav.primary"]}>
          <ul className="flex flex-wrap gap-1">
            {PRIMARY_NAV.map((item) => {
              const external = item.href === "/login" && signIn.external;
              const href = item.href === "/login" ? signIn.href : `/${locale}${item.href}`;
              const current = !external && path === item.href;
              const className = current
                ? `${navLink} bg-accent-strong`
                : `${navLink} hover:bg-accent`;
              return (
                <li key={item.href}>
                  {external ? (
                    <a href={href} className={className}>
                      {t[item.key]}
                    </a>
                  ) : (
                    <a href={href} aria-current={current ? "page" : undefined} className={className}>
                      {t[item.key]}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
