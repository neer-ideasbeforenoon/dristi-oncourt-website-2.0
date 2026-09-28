import type { Metadata } from "next";

import causeListPhoto from "@/assets/home/cause-list.jpg";
import certifiedCopiesPhoto from "@/assets/home/certified-copies.jpg";
import findCasePhoto from "@/assets/home/find-case.jpg";
import heroIllustration from "@/assets/services/hero.jpg";
import { Photo } from "@/components/portal/photo";
import { ServiceChoiceCard } from "@/components/portal/service-choice-card";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { liveHref } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: t["services.title"],
    description: t["services.description"],
    alternates: { canonical: `/${locale}/services` },
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
  const newTab = t["footer.newTab"];

  return (
    <main id="main">
      <section aria-labelledby="services-heading" className="relative isolate overflow-hidden bg-surface-raised">
        <div className={`${CONTAINER} relative z-10 flex flex-col pt-12 lg:min-h-[26.25rem] lg:justify-center lg:py-16`}>
          <div className="flex max-w-[39rem] flex-col gap-6">
            <p className="type-eyebrow text-primary">{t["services.eyebrow"]}</p>
            <h1 id="services-heading" className="type-display text-balance text-foreground">
              {t["services.heading"]}
            </h1>
            <p className="type-lead max-w-[35rem] text-muted-foreground">{t["services.intro"]}</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[calc(max(0px,(100%_-_var(--portal-content-max))/2)_+_27.5rem)] lg:aspect-auto">
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
          <span aria-hidden className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-surface-raised to-transparent" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-surface-raised to-transparent" />
        </div>
      </section>

      <section aria-labelledby="choose-heading" className="bg-background">
        <div className={`${CONTAINER} flex flex-col gap-7 pt-10 pb-16 lg:pb-20`}>
          <div className="flex flex-col gap-2">
            <p className="type-eyebrow text-primary">{t["services.choose.eyebrow"]}</p>
            <h2 id="choose-heading" className="type-services text-foreground">
              {t["services.choose.heading"]}
            </h2>
          </div>
          <ul className="grid gap-4.5 lg:grid-cols-3">
            <li className="flex">
              <ServiceChoiceCard
                image={causeListPhoto}
                number={1}
                category={t["services.causeList.category"]}
                heading={t["services.causeList.heading"]}
                body={t["services.causeList.body"]}
                actions={[{ label: t["services.causeList.action"], href: liveHref("causeList") }]}
                newTab={newTab}
              />
            </li>
            <li className="flex">
              <ServiceChoiceCard
                image={findCasePhoto}
                number={2}
                category={t["services.caseSearch.category"]}
                heading={t["services.caseSearch.heading"]}
                body={t["services.caseSearch.body"]}
                actions={[{ label: t["services.caseSearch.action"], href: liveHref("caseSearch") }]}
                newTab={newTab}
              />
            </li>
            <li className="flex">
              <ServiceChoiceCard
                image={certifiedCopiesPhoto}
                number={3}
                category={t["services.copies.category"]}
                heading={t["services.copies.heading"]}
                body={t["services.copies.body"]}
                actions={[
                  { label: t["services.copies.apply"], href: liveHref("certifiedCopiesApply") },
                  { label: t["services.copies.track"], href: liveHref("certifiedCopiesStatus") },
                ]}
                newTab={newTab}
              />
            </li>
          </ul>
          <p className="type-support rounded-xl border border-primary bg-primary px-6 py-6 text-primary-foreground">
            {t["services.jurisdiction"]}
          </p>
        </div>
      </section>
    </main>
  );
}
