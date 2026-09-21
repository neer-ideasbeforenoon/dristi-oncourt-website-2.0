import type { Metadata } from "next";

import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: t["home.title"],
    description: t["home.description"],
    alternates: { canonical: `/${locale}` },
  };
}

/**
 * The first page, and the shape every page after it follows: a server component that
 * returns its content directly. No `use client`, no effect, no fetch-then-render.
 *
 * `npm run check:ssr` reads the built HTML for this route and fails if the heading is
 * not in it.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return (
    <main
      id="main"
      className="mx-auto w-full px-4 py-12 max-w-[var(--portal-content-max)]"
    >
      <h1 className="text-title-l font-semibold">{t["home.heading"]}</h1>
      <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">
        {t["home.intro"]}
      </p>
    </main>
  );
}
