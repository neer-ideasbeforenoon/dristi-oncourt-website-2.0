import type { Metadata } from "next";

import heroIllustration from "@/assets/about/hero.jpg";
import michealGeorge from "@/assets/about/micheal-george.png";
import nitinJamdar from "@/assets/about/nitin-jamdar.png";
import sooryaSukumaran from "@/assets/about/soorya-sukumaran.png";
import { ArrowLink } from "@/components/portal/arrow-link";
import { focusRing } from "@/components/portal/focus";
import { JurisdictionMap } from "@/components/portal/jurisdiction-map";
import { places, type StationId } from "@/components/portal/kollam-map";
import { PersonCard } from "@/components/portal/person-card";
import { Photo } from "@/components/portal/photo";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import { getMessages, type Messages } from "@/lib/i18n/messages";
import { href } from "@/lib/routes";
import { cn } from "@/lib/utils";

const INTRO_VIDEO_ID = "EDDAkm4FvBc";
const INTRO_VIDEO = `https://www.youtube.com/watch?v=${INTRO_VIDEO_ID}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: t["about.title"],
    description: t["about.description"],
    alternates: { canonical: `/${locale}/about` },
  };
}

const CONTAINER = "mx-auto w-full max-w-[var(--portal-content-max)] px-4 sm:px-6 lg:px-8";

const STATION_KEYS = {
  kundara: "about.jurisdiction.station.kundara",
  sakthikulangara: "about.jurisdiction.station.sakthikulangara",
  anchalumood: "about.jurisdiction.station.anchalumood",
  kollamWest: "about.jurisdiction.station.kollamWest",
  kilikollur: "about.jurisdiction.station.kilikollur",
  pallithottam: "about.jurisdiction.station.pallithottam",
  kollamEast: "about.jurisdiction.station.kollamEast",
  kottiyam: "about.jurisdiction.station.kottiyam",
  eravipuram: "about.jurisdiction.station.eravipuram",
} as const satisfies Record<StationId, keyof Messages>;

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const t = getMessages(locale);
  const newTab = <span className="sr-only"> ({t["footer.newTab"]})</span>;

  const glance = [
    { value: t["about.glance.launch.value"], caption: t["about.glance.launch.caption"] },
    { value: t["about.glance.access.value"], caption: t["about.glance.access.caption"] },
    { value: t["about.glance.stations.value"], caption: t["about.glance.stations.caption"] },
  ];

  const principles = [
    { heading: t["about.principles.people.heading"], body: t["about.principles.people.body"] },
    { heading: t["about.principles.open.heading"], body: t["about.principles.open.body"] },
    { heading: t["about.principles.networked.heading"], body: t["about.principles.networked.body"] },
  ];

  const experience = [
    { heading: t["about.experience.accessible.heading"], body: t["about.experience.accessible.body"] },
    { heading: t["about.experience.assisted.heading"], body: t["about.experience.assisted.body"] },
    { heading: t["about.experience.seamless.heading"], body: t["about.experience.seamless.body"] },
  ];

  const benefits = [
    {
      heading: t["about.benefits.litigants.heading"],
      points: [t["about.benefits.litigants.1"], t["about.benefits.litigants.2"], t["about.benefits.litigants.3"]],
    },
    {
      heading: t["about.benefits.advocates.heading"],
      points: [t["about.benefits.advocates.1"], t["about.benefits.advocates.2"], t["about.benefits.advocates.3"]],
    },
    {
      heading: t["about.benefits.judges.heading"],
      points: [t["about.benefits.judges.1"], t["about.benefits.judges.2"], t["about.benefits.judges.3"]],
    },
    {
      heading: t["about.benefits.staff.heading"],
      points: [t["about.benefits.staff.1"], t["about.benefits.staff.2"], t["about.benefits.staff.3"]],
    },
  ];

  return (
    <main id="main">
      <section aria-labelledby="about-heading" className="relative isolate overflow-hidden bg-surface-raised">
        <div className={`${CONTAINER} relative z-10 flex flex-col pt-12 lg:min-h-[38rem] lg:justify-center lg:py-16`}>
          <div className="flex max-w-xl flex-col gap-6">
            <p className="type-eyebrow text-primary">{t["about.eyebrow"]}</p>
            <h1 id="about-heading" className="type-display text-balance text-foreground">
              {t["about.heading"]}
            </h1>
            <p className="type-lead text-muted-foreground">{t["about.intro"]}</p>
            <p className="type-support max-w-[var(--portal-measure)] text-muted-foreground">
              {t["about.launch"]}
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[calc(max(0px,(100%_-_var(--portal-content-max))/2)_+_30rem)] lg:aspect-auto">
          <Photo
            src={heroIllustration}
            alt=""
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 62vw, 100vw"
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

      <section aria-label={t["about.glance.label"]} className="bg-background py-6 lg:py-8">
        <ul className={`${CONTAINER} grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0`}>
          {glance.map((item) => (
            <li key={item.value} className="flex flex-col gap-2 py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <p className="type-card text-foreground">{item.value}</p>
              <p className="type-caption max-w-65 text-muted-foreground">{item.caption}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="vision" aria-labelledby="vision-heading" className="scroll-mt-16 bg-background">
        <div className={`${CONTAINER} grid grid-cols-1 items-center gap-12 pt-6 pb-16 lg:grid-cols-[11fr_9fr] lg:gap-16 lg:pt-8 lg:pb-24`}>
          <div className="flex flex-col gap-4">
            <p className="type-eyebrow text-primary">{t["about.vision.eyebrow"]}</p>
            <h2 id="vision-heading" className="type-services text-balance text-foreground">
              {t["about.vision.heading"]}
            </h2>
            <p className="type-body pt-2 text-muted-foreground">{t["about.vision.body1"]}</p>
            <p className="type-body text-muted-foreground">{t["about.vision.body2"]}</p>
            <ArrowLink href={href(locale, "videoTutorials")} className="mt-2 text-primary">
              {t["about.vision.action"]}
            </ArrowLink>
          </div>
          <figure className="flex flex-col overflow-hidden rounded-3xl bg-primary text-primary-foreground">
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${INTRO_VIDEO_ID}`}
                title={t["about.video.heading"]}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <figcaption className="flex flex-col gap-3 p-8">
              <span className="type-eyebrow text-primary-foreground">{t["about.video.eyebrow"]}</span>
              <span className="type-card">{t["about.video.heading"]}</span>
              <a
                href={INTRO_VIDEO}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "type-caption inline-flex min-h-10 items-center text-primary-foreground underline underline-offset-2",
                  focusRing,
                  "focus-visible:ring-primary-foreground"
                )}
              >
                {t["about.video.caption"]}
                {newTab}
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="principles"
        aria-labelledby="principles-heading"
        className="scroll-mt-16 bg-primary text-primary-foreground"
      >
        <div className={`${CONTAINER} flex flex-col gap-8 py-16 lg:py-24`}>
          <SectionIntro
            id="principles-heading"
            eyebrow={t["about.principles.eyebrow"]}
            heading={t["about.principles.heading"]}
            intro={t["about.principles.intro"]}
            onCanvas
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {principles.map((principle, index) => (
              <li
                key={principle.heading}
                className="flex min-h-70 flex-col justify-between gap-12 rounded-2xl border border-hairline bg-card p-6 text-foreground shadow-raised lg:p-8"
              >
                <span aria-hidden className="type-eyebrow text-primary">
                  {String(index + 1).padStart(2, "0")} /
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="type-card">{principle.heading}</h3>
                  <p className="type-support text-muted-foreground">{principle.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 bg-background">
        <div className={`${CONTAINER} grid grid-cols-1 gap-12 py-16 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:py-24`}>
          <SectionIntro
            id="experience-heading"
            eyebrow={t["about.experience.eyebrow"]}
            heading={t["about.experience.heading"]}
            intro={t["about.experience.intro"]}
          />
          <ol className="divide-y divide-hairline border-y border-hairline">
            {experience.map((item, index) => (
              <li key={item.heading} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)]">
                <span aria-hidden className="type-eyebrow pt-1 text-primary">
                  {String(index + 1).padStart(2, "0")} /
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="type-card text-foreground">{item.heading}</h3>
                  <p className="type-support text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="who-benefits"
        aria-labelledby="benefits-heading"
        className="scroll-mt-16 bg-primary text-primary-foreground"
      >
        <div className={`${CONTAINER} flex flex-col gap-8 py-16 lg:py-24`}>
          <SectionIntro
            id="benefits-heading"
            eyebrow={t["about.benefits.eyebrow"]}
            heading={t["about.benefits.heading"]}
            intro={t["about.benefits.intro"]}
            onCanvas
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((group) => (
              <li
                key={group.heading}
                className="flex min-h-80 flex-col gap-4 rounded-2xl border border-hairline bg-card p-6 text-foreground shadow-raised"
              >
                <h3 className="type-card">{group.heading}</h3>
                <ul className="flex flex-col gap-3">
                  {group.points.map((point) => (
                    <li key={point} className="type-support flex gap-3 text-muted-foreground">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="jurisdiction" aria-labelledby="jurisdiction-heading" className="scroll-mt-16 bg-surface-raised">
        <div className={`${CONTAINER} py-16 lg:py-24`}>
          <JurisdictionMap
            eyebrow={t["about.jurisdiction.eyebrow"]}
            heading={t["about.jurisdiction.heading"]}
            body={t["about.jurisdiction.body"]}
            count={t["about.jurisdiction.count"]}
            countLabel={t["about.jurisdiction.countLabel"]}
            stations={places.flatMap((place) =>
              place.kind === "station" ? [{ id: place.id, name: t[STATION_KEYS[place.id]] }] : [],
            )}
            mapTitle={t["about.jurisdiction.mapTitle"]}
            mapLabel={t["about.jurisdiction.mapLabel"]}
            hint={t["about.jurisdiction.hint"]}
            stationListLabel={t["about.jurisdiction.stationList"]}
            stationKind={t["about.jurisdiction.stationKind"]}
            stationSuffix={t["about.jurisdiction.stationSuffix"]}
            courtName={t["about.jurisdiction.courtName"]}
            courtKind={t["about.jurisdiction.courtKind"]}
            district={t["about.jurisdiction.district"]}
            caption={t["about.jurisdiction.mapCaption"]}
          />
        </div>
        <div className={`${CONTAINER} pb-16 lg:pb-24`}>
          <figure className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card px-6 py-8 shadow-raised sm:px-8">
            <blockquote>
              <p className="type-card text-foreground">{t["about.quote.text"]}</p>
            </blockquote>
            <figcaption className="type-caption text-muted-foreground">{t["about.quote.cite"]}</figcaption>
          </figure>
        </div>
      </section>

      <section
        id="people"
        aria-labelledby="people-heading"
        className="scroll-mt-16 bg-primary text-primary-foreground"
      >
        <div className={`${CONTAINER} flex flex-col gap-4 py-16 lg:py-24`}>
          <div className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="flex flex-1 flex-col gap-4">
              <p className="type-eyebrow text-primary-foreground">{t["about.people.eyebrow"]}</p>
              <h2 id="people-heading" className="type-services text-balance">
                {t["about.people.heading"]}
              </h2>
            </div>
            <p className="type-body text-primary-foreground lg:max-w-md">
              {t["about.people.intro"]}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <PersonCard
              portrait={nitinJamdar}
              organisation={t["about.people.chiefJustice.org"]}
              name={t["about.people.chiefJustice.name"]}
              role={t["about.people.chiefJustice.role"]}
            />
            <PersonCard
              portrait={michealGeorge}
              organisation={t["about.people.magistrate.org"]}
              name={t["about.people.magistrate.name"]}
              role={t["about.people.magistrate.role"]}
              note={t["about.people.magistrate.note"]}
            />
          </div>
          <div className="flex items-center gap-6 rounded-2xl border border-hairline bg-card px-6 py-4 text-foreground shadow-raised">
            <div className="relative h-23 w-18 shrink-0 overflow-hidden rounded-lg bg-brand-muted">
              <Photo src={sooryaSukumaran} alt="" fill sizes="72px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="type-eyebrow text-muted-foreground">{t["about.people.former.label"]}</p>
              <h3 className="type-card">{t["about.people.former.name"]}</h3>
              <p className="type-caption text-muted-foreground">{t["about.people.former.role"]}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({
  id,
  eyebrow,
  heading,
  intro,
  onCanvas = false,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro: string;
  onCanvas?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className={cn("type-eyebrow", onCanvas ? "text-primary-foreground" : "text-primary")}>
        {eyebrow}
      </p>
      <h2 id={id} className={cn("type-services text-balance", !onCanvas && "text-foreground")}>
        {heading}
      </h2>
      <p
        className={cn(
          "type-body max-w-2xl",
          onCanvas ? "text-primary-foreground" : "text-muted-foreground"
        )}
      >
        {intro}
      </p>
    </div>
  );
}
