import { Card } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/lib/dashboard-snapshot";
import { HTML_LANG, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

/**
 * Three headline figures from the public dashboard, each with a small chart. Every
 * chart is decorative over text that states the same numbers, so nothing here is
 * conveyed by colour or shape alone.
 */
export function CourtDataSnapshot({
  snapshot,
  locale,
  t,
}: {
  snapshot: DashboardSnapshot;
  locale: Locale;
  t: Messages;
}) {
  const number = new Intl.NumberFormat(HTML_LANG[locale]);
  const { filed, disposed, hearingGapDays } = snapshot;
  const busiest = Math.max(...filed.byQuarter.map((q) => q.count));
  const outcomes = [
    { label: t["home.data.disposed.withdrawn"], share: `${disposed.withdrawn}%`, width: disposed.withdrawn, tone: "bg-primary" },
    { label: t["home.data.disposed.dismissed"], share: `${disposed.dismissed}%`, width: disposed.dismissed, tone: "bg-primary/55" },
    { label: t["home.data.disposed.other"], share: `≈${disposed.other}%`, width: disposed.other, tone: "bg-primary/15" },
  ];
  const gap = `${number.format(hearingGapDays)} ${t["home.data.gap.unit"]}`;

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      <MetricCard
        index="01"
        label={t["home.data.filed.label"]}
        value={number.format(filed.total)}
        caption={t["home.data.filed.caption"]}
        chartTitle={t["home.data.filed.chart"]}
      >
        <ol className="grid grid-cols-4 items-end gap-2">
          {filed.byQuarter.map((quarter) => (
            <li key={quarter.label} className="type-caption flex flex-col gap-1">
              <span className="font-bold text-foreground">{number.format(quarter.count)}</span>
              <span
                aria-hidden
                className={cn("rounded-xs", quarter.toDate ? "bg-primary" : "bg-primary/40")}
                style={{ height: `${(quarter.count / busiest) * 3}rem` }}
              />
              <span className="whitespace-nowrap text-muted-foreground">{quarter.label}</span>
            </li>
          ))}
        </ol>
      </MetricCard>

      <MetricCard
        index="02"
        label={t["home.data.disposed.label"]}
        value={number.format(disposed.total)}
        caption={t["home.data.disposed.caption"]}
        chartTitle={t["home.data.disposed.chart"]}
      >
        <div aria-hidden className="flex h-5 overflow-hidden rounded-md">
          {outcomes.map((o) => (
            <span key={o.label} className={o.tone} style={{ width: `${o.width}%` }} />
          ))}
        </div>
        <ul className="flex flex-col gap-1">
          {outcomes.map((o) => (
            <li key={o.label} className="type-caption flex items-center gap-2 text-muted-foreground">
              <span aria-hidden className={cn("size-2 shrink-0 rounded-xs", o.tone)} />
              <span className="flex-1">{o.label}</span>
              <span className="font-bold text-foreground">{o.share}</span>
            </li>
          ))}
        </ul>
      </MetricCard>

      <MetricCard
        index="03"
        label={t["home.data.gap.label"]}
        value={
          <>
            {number.format(hearingGapDays)}{" "}
            <span className="type-action">{t["home.data.gap.unit"]}</span>
          </>
        }
        caption={t["home.data.gap.caption"]}
        chartTitle={t["home.data.gap.chart"]}
      >
        <div aria-hidden className="relative flex items-center justify-between">
          <span className="absolute inset-x-1 h-0.5 bg-primary/55" />
          <span className="relative size-3 rounded-full border-3 border-primary bg-card" />
          <span className="relative size-3 rounded-full border-3 border-primary bg-card" />
        </div>
        <p className="type-caption flex justify-between gap-2 text-muted-foreground">
          <span>{t["home.data.gap.first"]}</span>
          <span className="font-bold text-foreground">{gap}</span>
          <span>{t["home.data.gap.second"]}</span>
        </p>
      </MetricCard>
    </ul>
  );
}

function MetricCard({
  index,
  label,
  value,
  caption,
  chartTitle,
  children,
}: {
  index: string;
  label: string;
  value: React.ReactNode;
  caption: string;
  chartTitle: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex">
      <Card size="sm" className="flex-1 justify-between gap-6 rounded-2xl px-4">
        <div className="flex flex-col gap-2">
          <h3 className="flex items-baseline gap-2">
            <span aria-hidden className="type-eyebrow text-primary">
              {index} /
            </span>
            <span className="type-nav text-muted-foreground">{label}</span>
          </h3>
          <p className="type-figure text-foreground">{value}</p>
          <p className="type-caption text-muted-foreground">{caption}</p>
        </div>
        <div className="flex flex-col gap-3 border-t border-hairline pt-3">
          <p className="type-caption text-muted-foreground">{chartTitle}</p>
          {children}
        </div>
      </Card>
    </li>
  );
}
