"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { focusRing, navLink } from "@/components/chrome/styles";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { helplineHref, loginHref } from "@/lib/site";

export type NavItem = { href: string; label: string };

export type LocaleChoice = {
  code: Locale;
  label: string;
  hrefLang: string;
};

/**
 * Identity, language, helpline, and the service navigation.
 * The current path is read here so a language switch keeps the page the reader
 * is on, and so the current item can be marked. Copy arrives as props from the
 * server layout; this file holds no sentences of its own.
 */
export function SiteHeader({
  locale,
  name,
  tagline,
  navLabel,
  languageLabel,
  helplineLabel,
  helpline,
  items,
  locales,
}: {
  locale: Locale;
  name: string;
  tagline: string;
  navLabel: string;
  languageLabel: string;
  helplineLabel: string;
  helpline: string | null;
  items: readonly NavItem[];
  locales: readonly LocaleChoice[];
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const phone = helplineHref(helpline);
  const signIn = loginHref(locale);

  function withLocale(next: Locale): string {
    const parts = pathname.split("/");
    if (isLocale(parts[1] ?? "")) {
      parts[1] = next;
      const nextPath = parts.join("/");
      return nextPath === "" ? `/${next}` : nextPath;
    }
    return `/${next}`;
  }

  return (
    <header className="border-border bg-background border-b">
      <div className="border-border border-b">
        <div className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-wrap items-center justify-end gap-2 px-4 py-2">
          {phone && helpline ? (
            <a href={phone} className={navLink}>
              {helplineLabel}
              <span className="text-muted-foreground ms-2">{helpline}</span>
            </a>
          ) : null}
          <nav aria-label={languageLabel} className="flex flex-wrap items-center gap-1">
            {locales.map((choice) => {
              const current = choice.code === locale;
              if (current) {
                return (
                  <span
                    key={choice.code}
                    aria-current="true"
                    lang={choice.hrefLang}
                    className="bg-accent-strong inline-flex h-10 items-center rounded-lg px-3 text-body-compact font-medium"
                  >
                    {choice.label}
                  </span>
                );
              }
              return (
                <Link
                  key={choice.code}
                  href={withLocale(choice.code)}
                  hrefLang={choice.hrefLang}
                  lang={choice.hrefLang}
                  className={`${navLink} hover:bg-accent`}
                >
                  {choice.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-col gap-4 px-4 py-4">
        <div className="max-w-[var(--portal-measure)]">
          <Link
            href={`/${locale}`}
            className={`inline-flex h-10 items-center rounded-lg text-title-s font-semibold ${focusRing}`}
          >
            {name}
          </Link>
          <p className="text-body text-muted-foreground mt-1">{tagline}</p>
        </div>
        <nav aria-label={navLabel}>
          <ul className="flex flex-wrap gap-1">
            {items.map((item) => {
              const external = item.href === "/login" && signIn.external;
              const href = item.href === "/login" ? signIn.href : `/${locale}${item.href}`;
              const current = !external && pathname === href;
              const className = current
                ? `${navLink} bg-accent-strong`
                : `${navLink} hover:bg-accent`;
              return (
                <li key={item.href}>
                  {external ? (
                    <a href={href} className={className}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={href} aria-current={current ? "page" : undefined} className={className}>
                      {item.label}
                    </Link>
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
