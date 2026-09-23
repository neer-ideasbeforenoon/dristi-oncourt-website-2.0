import type { Metadata } from "next";

import { SiteChrome } from "@/components/chrome/site-chrome";
import { primaryAction, secondaryAction, textAction } from "@/components/chrome/styles";
import { readPage } from "@/lib/page";
import { helplineHref, loginHref, site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale, t } = await readPage(params);
  return {
    title: t["home.title"],
    description: t["home.description"],
    alternates: { canonical: `/${locale}` },
  };
}

/**
 * Homepage region order is locked in docs/ia.md. The first screen is the cause
 * list, then log in, then case search. About, performance, video, and questions
 * stay on the page, below those services.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await readPage(params);
  const signIn = loginHref(locale);
  const phone = helplineHref(site.helpline);

  return (
    <SiteChrome locale={locale} path="" t={t}>
    <main
      id="main"
      className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-col gap-12 px-4 py-8"
    >
      <div className="flex flex-col gap-6">
        <section
          aria-labelledby="today-cause-list"
          className="border-border bg-card rounded-xl border p-6"
        >
          <h1 id="today-cause-list" className="text-title-l font-semibold">
            {t["home.heading"]}
          </h1>
          <p className="text-body mt-4 max-w-[var(--portal-measure)]">{t["home.intro"]}</p>
          <a href={`/${locale}/cause-list`} className={`${secondaryAction} mt-6`}>
            {t["home.causeList.action"]}
          </a>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section
            aria-labelledby="home-login"
            className="border-border bg-card flex flex-col gap-4 rounded-xl border p-6"
          >
            <h2 id="home-login" className="text-title-s font-semibold">
              {t["nav.login"]}
            </h2>
            <p className="text-body max-w-[var(--portal-measure)]">{t["home.login.body"]}</p>
            {signIn.external ? (
              <a href={signIn.href} className={`${primaryAction} self-start`}>
                {t["home.login.action"]}
              </a>
            ) : (
              <a href={signIn.href} className={`${primaryAction} self-start`}>
                {t["home.login.action"]}
              </a>
            )}
          </section>

          <section
            aria-labelledby="home-search"
            className="border-border bg-card flex flex-col gap-4 rounded-xl border p-6"
          >
            <h2 id="home-search" className="text-title-s font-semibold">
              {t["nav.caseSearch"]}
            </h2>
            <p className="text-body max-w-[var(--portal-measure)]">{t["home.search.body"]}</p>
            <a href={`/${locale}/search`} className={`${secondaryAction} self-start`}>
              {t["home.search.action"]}
            </a>
          </section>
        </div>

        {phone && site.helpline ? (
          <section
            aria-labelledby="home-helpline"
            className="border-border bg-card rounded-xl border p-6"
          >
            <h2 id="home-helpline" className="text-title-s font-semibold">
              {t["home.helpline.heading"]}
            </h2>
            <p className="text-body mt-4 max-w-[var(--portal-measure)]">{t["home.helpline.body"]}</p>
            <a href={phone} className={`${secondaryAction} mt-6`}>
              {site.helpline}
            </a>
          </section>
        ) : null}
      </div>

      <div className="flex flex-col gap-8">
        <section aria-labelledby="home-dashboard" className="max-w-[var(--portal-measure)]">
          <h2 id="home-dashboard" className="text-title-s font-semibold">
            {t["home.dashboard.heading"]}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{t["home.dashboard.body"]}</p>
          <a href={`/${locale}/dashboard`} className={`${textAction} mt-2`}>
            {t["home.dashboard.action"]}
          </a>
        </section>

        <section aria-labelledby="home-highlights" className="max-w-[var(--portal-measure)]">
          <h2 id="home-highlights" className="text-title-s font-semibold">
            {t["home.highlights.heading"]}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{t["home.highlights.body"]}</p>
        </section>

        <section aria-labelledby="home-video" className="max-w-[var(--portal-measure)]">
          <h2 id="home-video" className="text-title-s font-semibold">
            {t["home.video.heading"]}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{t["home.video.body"]}</p>
        </section>

        <section aria-labelledby="home-about" className="max-w-[var(--portal-measure)]">
          <h2 id="home-about" className="text-title-s font-semibold">
            {t["home.about.heading"]}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{t["home.about.body"]}</p>
          <a href={`/${locale}/about`} className={`${textAction} mt-2`}>
            {t["home.about.action"]}
          </a>
        </section>

        <section aria-labelledby="home-faq" className="max-w-[var(--portal-measure)]">
          <h2 id="home-faq" className="text-title-s font-semibold">
            {t["home.faq.heading"]}
          </h2>
          <p className="text-body text-muted-foreground mt-4">{t["home.faq.body"]}</p>
          <a href={`/${locale}/help`} className={`${textAction} mt-2`}>
            {t["home.faq.action"]}
          </a>
        </section>
      </div>
    </main>
    </SiteChrome>
  );
}
