import type { Metadata } from "next";
import { CalendarDays, CircleCheck, Clock3, Download, FileText, Info, type LucideIcon } from "lucide-react";

import { ActivityPanel, type ActivityQuarter } from "@/components/portal/dashboard/activity-panel";
import { DashboardPanel } from "@/components/portal/dashboard/dashboard-panel";
import { ShareBar } from "@/components/portal/dashboard/share-bar";
import { TabbedPanel } from "@/components/portal/dashboard/tabbed-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { outcomeLabel, quarterLabel, stageLabel } from "@/lib/dashboard-labels";
import { activityPeriods, DASHBOARD_SNAPSHOT, pendingShare } from "@/lib/dashboard-snapshot";
import { courtDate } from "@/lib/dates";
import { DEFAULT_LOCALE, HTML_LANG, isLocale } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/fill";
import { getMessages } from "@/lib/i18n/messages";
import { href } from "@/lib/routes";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getMessages(isLocale(locale) ? locale : DEFAULT_LOCALE);
  return {
    title: t["dashboard.title"],
    description: t["dashboard.description"],
    alternates: { canonical: `/${locale}/dashboard` },
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
  const s = DASHBOARD_SNAPSHOT;
  const { totals, timing } = s;

  const number = new Intl.NumberFormat(HTML_LANG[locale]);
  const decimal = new Intl.NumberFormat(HTML_LANG[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const percent = (value: number) => `${decimal.format(value)}%`;
  const days = (count: number) => fill(t["dashboard.timing.daysCount"], { count: number.format(count) });
  const observed = courtDate(s.asOf, locale).label;
  const csvBase = href(locale, "dashboardCsv");
  const csv = (view: string) => `${csvBase}?view=${view}`;

  const lastComplete = s.quarters.findLastIndex((q) => !q.partial);
  const quarters: ActivityQuarter[] = s.quarters.map((q, index) => {
    const label = quarterLabel(t, q);
    const disposed =
      q.disposed === null
        ? t["dashboard.activity.disposedMissing"]
        : fill(t["dashboard.activity.disposedCount"], { count: number.format(q.disposed) });
    return {
      index,
      year: q.year,
      months: t[`dashboard.quarter.${q.quarter}` as const],
      label,
      filed: q.filed,
      disposed: q.disposed,
      partial: Boolean(q.partial),
      aria: fill(t["dashboard.activity.quarterAria"], {
        quarter: q.partial ? `${label}, ${t["dashboard.activity.partialAria"]}` : label,
        filed: number.format(q.filed),
        disposed,
      }),
      status: q.partial
        ? t["dashboard.activity.status.partial"]
        : index === lastComplete
          ? t["dashboard.activity.status.latest"]
          : t["dashboard.activity.status.complete"],
    };
  });
  const scaleMax = Math.ceil(Math.max(...s.quarters.flatMap((q) => [q.filed, q.disposed ?? 0])) / 100) * 100;

  const largestStage = s.stages.reduce((a, b) => (b.count > a.count ? b : a));
  const outcomeTotal = s.outcomes.reduce((sum, o) => sum + o.share, 0);
  const rulingsTotal = s.rulings.reduce((sum, r) => sum + r.count, 0);
  const timingMax = Math.ceil(Math.max(...s.stageTiming.map((st) => st.days)) / 50) * 50;

  const metrics: { icon: LucideIcon; key: "filed" | "pending" | "disposed"; value: number }[] = [
    { icon: FileText, key: "filed", value: totals.filed },
    { icon: Clock3, key: "pending", value: totals.pending },
    { icon: CircleCheck, key: "disposed", value: totals.disposed },
  ];

  return (
    <main id="main">
      <div className={`${CONTAINER} flex flex-col gap-6 py-8 lg:py-12`}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="type-eyebrow text-primary">{t["dashboard.eyebrow"]}</p>
            <h1 className="type-section text-foreground">{t["dashboard.heading"]}</h1>
            <p className="type-lead text-muted-foreground">{t["dashboard.intro"]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:flex-col sm:items-end">
            <p className="type-caption flex items-center gap-2 text-muted-foreground">
              <CalendarDays aria-hidden className="size-4 text-primary" />
              {fill(t["dashboard.snapshot"], { date: observed })}
            </p>
            <Button asChild variant="outline" className="type-nav">
              <a href={csv("all")} download>
                <Download aria-hidden data-icon="inline-start" />
                {t["dashboard.download"]}
              </a>
            </Button>
          </div>
        </div>

        <section aria-label={t["dashboard.overview.label"]}>
          <Card className="gap-0 divide-y divide-hairline rounded-2xl py-0">
            <div className="flex flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 id="people-heading" className="type-panel text-foreground">
                  {t["dashboard.people.heading"]}
                </h2>
                <p className="type-caption text-muted-foreground">{t["dashboard.people.body"]}</p>
              </div>
              <dl className="flex gap-12">
                {(["advocates", "litigants"] as const).map((key) => (
                  <div key={key} className="flex flex-col-reverse gap-1">
                    <dt className="type-caption text-muted-foreground">{t[`dashboard.people.${key}`]}</dt>
                    <dd className="type-figure-s text-foreground">{number.format(s.participants[key])}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <dl className="grid divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {metrics.map(({ icon: Icon, key, value }) => (
                <div key={key} className="flex flex-col gap-2 p-6">
                  <dt className="type-nav flex items-center gap-2 text-foreground">
                    <Icon aria-hidden className="size-4 text-primary" />
                    {t[`dashboard.overview.${key}.label`]}
                  </dt>
                  <dd className="type-figure text-foreground">{number.format(value)}</dd>
                  <dd className="type-caption flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
                    <span>{t[`dashboard.overview.${key}.caption`]}</span>
                    <Badge variant="secondary">{t[`dashboard.overview.${key}.tag`]}</Badge>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.58fr)_minmax(0,1fr)]">
          <ActivityPanel
            id="activity"
            quarters={quarters}
            initialIndex={lastComplete}
            scaleMax={scaleMax}
            htmlLang={HTML_LANG[locale]}
            labels={{
              kicker: t["dashboard.activity.kicker"],
              heading: t["dashboard.activity.heading"],
              description: t["dashboard.activity.description"],
              period: t["dashboard.activity.period"],
              periods: activityPeriods(s).map((value) => ({
                value,
                label: value === "all" ? t["dashboard.activity.period.all"] : value,
              })),
              filed: t["dashboard.activity.filed"],
              disposed: t["dashboard.activity.disposed"],
              partial: t["dashboard.activity.partial"],
              notReported: t["dashboard.notReported"],
              hint: t["dashboard.activity.hint"],
              swipe: t["dashboard.activity.swipe"],
              chartLabel: t["dashboard.activity.chartLabel"],
              chartTitle: t["dashboard.activity.chartTitle"],
              chartDesc: fill(t["dashboard.activity.chartDesc"], { max: number.format(scaleMax) }),
              chartDescPartial: t["dashboard.activity.chartDescPartial"],
            }}
          />

          <DashboardPanel
            id="pending"
            kicker={t["dashboard.pending.kicker"]}
            heading={t["dashboard.pending.heading"]}
            description={fill(t["dashboard.pending.description"], { count: number.format(totals.pending) })}
          >
            <ul className="grid gap-6 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
              {s.stages.map((stage) => {
                const largest = stage.id === largestStage.id;
                return (
                  <li key={stage.id} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className={cn("type-support", largest ? "font-bold text-primary" : "text-foreground")}>
                        {stageLabel(t, stage.id)}
                      </span>
                      <span className="flex items-baseline gap-3">
                        <span className="type-nav tabular-nums text-foreground">{number.format(stage.count)}</span>
                        <span className="type-caption w-12 text-right tabular-nums text-muted-foreground">
                          {percent(pendingShare(s, stage.count))}
                        </span>
                      </span>
                    </div>
                    <ShareBar value={pendingShare(s, stage.count)} emphasis={largest} />
                  </li>
                );
              })}
            </ul>
            <p className="type-caption mt-auto flex gap-2 text-muted-foreground">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              {fill(t["dashboard.pending.context"], {
                share: percent(pendingShare(s, largestStage.count)),
                stage: stageLabel(t, largestStage.id),
              })}
            </p>
          </DashboardPanel>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <TabbedPanel
            id="outcomes"
            kicker={t["dashboard.outcomes.kicker"]}
            heading={t["dashboard.outcomes.heading"]}
            tabsLabel={t["dashboard.outcomes.tabs"]}
            views={[
              {
                value: "all",
                label: t["dashboard.outcomes.tab.all"],
                content: (
                  <ShareList
                    total={fill(t["dashboard.outcomes.all.total"], { count: number.format(totals.disposed) })}
                    shareOf={t["dashboard.outcomes.all.shareOf"]}
                    rows={s.outcomes.map((o) => ({ label: outcomeLabel(t, o.id), share: o.share, text: `${number.format(o.share)}%` }))}
                    note={fill(t["dashboard.outcomes.all.note"], { total: outcomeTotal })}
                  />
                ),
              },
              {
                value: "rulings",
                label: t["dashboard.outcomes.tab.rulings"],
                content: (
                  <ShareList
                    total={fill(t["dashboard.outcomes.rulings.total"], { count: number.format(rulingsTotal) })}
                    shareOf={t["dashboard.outcomes.rulings.shareOf"]}
                    rows={s.rulings.map((r) => {
                      const share = (r.count / rulingsTotal) * 100;
                      return { label: outcomeLabel(t, r.id), share, text: percent(share) };
                    })}
                    note={fill(t["dashboard.outcomes.rulings.note"], { count: number.format(rulingsTotal) })}
                  >
                    <dl className="grid grid-cols-2 gap-4">
                      {s.rulings.map((r) => (
                        <div
                          key={r.id}
                          className="flex flex-col-reverse gap-1 rounded-xl border border-hairline bg-surface-sunken p-4"
                        >
                          <dt className="type-caption text-muted-foreground">{outcomeLabel(t, r.id)}</dt>
                          <dd className="type-figure-s text-foreground">{number.format(r.count)}</dd>
                        </div>
                      ))}
                    </dl>
                  </ShareList>
                ),
              },
            ]}
          />

          <TabbedPanel
            id="timing"
            kicker={t["dashboard.timing.kicker"]}
            heading={t["dashboard.timing.heading"]}
            tabsLabel={t["dashboard.timing.tabs"]}
            views={[
              {
                value: "overview",
                label: t["dashboard.timing.tab.overview"],
                content: (
                  <div className="flex flex-col gap-6">
                    <dl className="grid grid-cols-2 gap-3">
                      {(
                        [
                          {
                            label: t["dashboard.timing.daysToDisposal"],
                            value: days(timing.daysToDisposal),
                          },
                          {
                            label: t["dashboard.timing.excludingMediation"],
                            value: days(timing.daysExcludingMediation),
                          },
                          {
                            label: t["dashboard.timing.hearingsToDisposal"],
                            value: number.format(timing.hearingsToDisposal),
                          },
                          {
                            label: t["dashboard.timing.betweenHearings"],
                            value: days(timing.daysBetweenHearings),
                          },
                        ] as const
                      ).map((item) => (
                        <div
                          key={item.label}
                          className="flex flex-col-reverse gap-1 rounded-xl border border-hairline bg-surface-sunken p-4"
                        >
                          <dt className="type-caption text-muted-foreground">{item.label}</dt>
                          <dd className="type-figure-s text-foreground">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="type-caption text-muted-foreground">{t["dashboard.timing.overview.note"]}</p>
                  </div>
                ),
              },
              {
                value: "stages",
                label: t["dashboard.timing.tab.stages"],
                content: (
                  <div className="flex flex-col gap-4">
                    <Table className="type-caption tabular-nums">
                      <TableHeader>
                        <TableRow className="border-hairline hover:bg-transparent">
                          <TableHead scope="col" className="text-muted-foreground">
                            {t["dashboard.timing.stages.stage"]}
                          </TableHead>
                          <TableHead scope="col" colSpan={2} className="text-muted-foreground">
                            {fill(t["dashboard.timing.stages.days"], { max: timingMax })}
                          </TableHead>
                          <TableHead scope="col" className="text-right text-muted-foreground">
                            {t["dashboard.timing.stages.hearings"]}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {s.stageTiming.map((stage, index) => (
                          <TableRow key={stage.id} className="border-hairline">
                            <TableHead scope="row" className="font-normal">
                              {stageLabel(t, stage.id)}
                            </TableHead>
                            <TableCell className="w-full min-w-16">
                              <ShareBar
                                value={stage.days}
                                max={timingMax}
                                emphasis={index === s.stageTiming.length - 1}
                                className="h-1.5"
                              />
                            </TableCell>
                            <TableCell className="text-right font-bold">{number.format(stage.days)}</TableCell>
                            <TableCell className="text-right font-bold">
                              {stage.hearings === null ? (
                                <span className="font-normal text-muted-foreground">{t["dashboard.notReported"]}</span>
                              ) : (
                                number.format(stage.hearings)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="type-caption text-muted-foreground">{t["dashboard.timing.stages.note"]}</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </main>
  );
}

/** A labelled list of share bars with a total above and a caveat below. */
function ShareList({
  total,
  shareOf,
  rows,
  note,
  children,
}: {
  total: string;
  shareOf: string;
  rows: { label: string; share: number; text: string }[];
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="type-nav text-foreground">{total}</span>
        <span className="type-caption text-muted-foreground">{shareOf}</span>
      </p>
      <ul className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)_3.5rem] items-center gap-4 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3.5rem]"
          >
            <span className="type-caption text-foreground">{row.label}</span>
            <ShareBar value={row.share} emphasis={index === 0} />
            <span className="type-caption text-right font-bold tabular-nums text-foreground">{row.text}</span>
          </li>
        ))}
      </ul>
      {children}
      <p className="type-caption text-muted-foreground">{note}</p>
    </div>
  );
}
