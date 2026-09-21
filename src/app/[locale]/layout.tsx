import type { Metadata } from "next";
import { Noto_Sans_Malayalam } from "next/font/google";
import { notFound } from "next/navigation";

import "../app.css";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * This is the root layout. There is deliberately no `src/app/layout.tsx` above it:
 * `<html lang>` has to be decided per locale, and it has to be decided on the server.
 *
 * The portal being replaced sets `lang` from a `useEffect`, so every page it serves is
 * `lang="en"` no matter which language the reader chose. A screen reader announcing
 * Malayalam text with English phonemes is not a cosmetic bug, and it is invisible to
 * anyone testing in a browser with JavaScript on.
 */

/**
 * Malayalam has no dependable system font across Windows, Android and macOS, so this is
 * the one webfont the portal carries. 600 is not optional: the DS title roles are
 * `font-semibold`, and a family without a 600 face gets synthesised or snapped to bold.
 * `scripts/check-typography.mjs` enforces that weight.
 */
const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  weight: ["400", "600"],
  variable: "--portal-font-malayalam",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: { default: t["site.name"], template: `%s · ${t["site.name"]}` },
    description: t["home.description"],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}`])),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={HTML_LANG[locale]} className={notoMalayalam.variable}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
