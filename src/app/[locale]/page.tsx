import type { Metadata } from "next";
import { Clock3, FileText, Landmark, MapPin, Search } from "lucide-react";

import causeListPhoto from "@/assets/home/cause-list.jpg";
import certifiedCopiesPhoto from "@/assets/home/certified-copies.jpg";
import courtDataPhoto from "@/assets/home/court-data.jpg";
import findCasePhoto from "@/assets/home/find-case.jpg";
import heroIllustration from "@/assets/home/hero.jpg";
import { CauseListCard } from "@/components/portal/cause-list-card";
import { CourtDataSnapshot } from "@/components/portal/court-data-snapshot";
import { Photo } from "@/components/portal/photo";
import { ServiceCard } from "@/components/portal/service-card";
import { Button } from "@/components/ui/button";
import { DASHBOARD_SNAPSHOT } from "@/lib/dashboard-snapshot";
import { courtDate, courtToday } from "@/lib/dates";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { href } from "@/lib/routes";

/** Re-render hourly so "today's cause list" carries today's date, not the build's. */
export const revalidate = 3600;

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

const CONTAINER = "mx-auto w-full max-w-[var(--portal-content-max)] px-4 sm:px-6 lg:px-8";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const t = getMessages(locale);
  const snapshotDate = courtDate(DASHBOARD_SNAPSHOT.asOf, locale);

  const principles = [
    { icon: Clock3, label: t["home.principles.access"] },
    { icon: Landmark, label: t["home.principles.courtLed"] },
    { icon: MapPin, label: t["home.principles.location"] },
  ];

  return (
    <main id="main">
      <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-surface-raised">
        <div className={`${CONTAINER} relative z-10 flex flex-col pt-12 lg:min-h-[38rem] lg:justify-center lg:py-16`}>
          <div className="flex max-w-xl flex-col gap-6 lg:max-w-[34rem]">
            <p className="type-eyebrow text-primary">{t["home.eyebrow"]}</p>
            <h1 id="hero-heading" className="type-display text-balance text-foreground">
              {t["home.heading"]}
            </h1>
            <p className="type-lead text-muted-foreground">{t["home.intro"]}</p>
            <ul aria-label={t["home.principles.label"]} className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
              {principles.map(({ icon: Icon, label }) => (
                <li key={label} className="type-caption flex items-center gap-2 text-foreground">
                  <Icon aria-hidden className="size-4 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[calc(max(0px,(100%_-_var(--portal-content-max))/2)_+_32rem)] lg:aspect-auto">
          <Photo
            src={heroIllustration}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 61vw, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 hidden bg-(image:--portal-hero-scrim) lg:block"
          />
          <span aria-hidden className="absolute inset-x-0 top-0 h-30 bg-linear-to-b from-surface-raised to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-30 bg-linear-to-t from-surface-raised to-transparent" />
        </div>
      </section>

      <section id="services" aria-labelledby="services-heading" className="scroll-mt-4">
        <div className={`${CONTAINER} flex flex-col gap-8 py-16`}>
          <div className="flex max-w-3xl flex-col gap-3">
            <h2 id="services-heading" className="type-services text-foreground">
              {t["home.services.heading"]}
            </h2>
            <p className="type-body text-muted-foreground">{t["home.services.intro"]}</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[6fr_5fr]">
            <CauseListCard
              image={causeListPhoto}
              date={courtToday(locale)}
              heading={t["home.causeList.heading"]}
              body={t["home.causeList.body"]}
              actionLabel={t["home.causeList.action"]}
              actionHref={href(locale, "causeList")}
            />
            <div className="flex flex-col gap-6">
              <ServiceCard
                image={findCasePhoto}
                icon={Search}
                heading={t["home.caseSearch.heading"]}
                body={t["home.caseSearch.body"]}
                actionLabel={t["home.caseSearch.action"]}
                actionHref={href(locale, "caseSearch")}
              />
              <ServiceCard
                image={certifiedCopiesPhoto}
                icon={FileText}
                heading={t["home.copies.heading"]}
                body={t["home.copies.body"]}
                actionLabel={t["home.copies.action"]}
                actionHref={href(locale, "certifiedCopies")}
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="data-heading" className="bg-surface-raised">
        <div className={`${CONTAINER} flex gap-12 py-16`}>
          <div aria-hidden className="relative hidden w-85 shrink-0 overflow-hidden rounded-3xl lg:block">
            <Photo src={courtDataPhoto} alt="" fill sizes="340px" quality={90} className="object-cover" />
            <div className="absolute bottom-6 left-6 flex w-65 flex-col gap-1.5 rounded-xl border border-hairline bg-card p-4 shadow-raised">
              <p className="type-eyebrow text-primary">{t["home.data.eyebrow"]}</p>
              <p className="type-lead text-foreground">{t["home.data.photoLabel"]}</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4 sm:items-center">
              <div className="flex max-w-md flex-col gap-3">
                <p className="type-eyebrow text-primary">{t["home.data.eyebrow"]}</p>
                <h2 id="data-heading" className="type-section text-foreground">
                  {t["home.data.heading"]}
                </h2>
                <p className="type-body text-muted-foreground">{t["home.data.intro"]}</p>
              </div>
              <Button asChild size="lg" className="type-action">
                <a href={href(locale, "dashboard")}>{t["home.data.action"]}</a>
              </Button>
            </div>
            <CourtDataSnapshot snapshot={DASHBOARD_SNAPSHOT} locale={locale} t={t} />
            <p className="type-caption text-muted-foreground">
              {t["home.data.footnote"].replace("{date}", snapshotDate.label)}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
