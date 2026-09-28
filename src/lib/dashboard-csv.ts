import { outcomeLabel, quarterLabel, stageLabel } from "@/lib/dashboard-labels";
import {
  activityPeriods,
  pendingShare,
  quartersFor,
  type DashboardSnapshot,
} from "@/lib/dashboard-snapshot";
import { fill } from "@/lib/i18n/fill";
import type { Messages } from "@/lib/i18n/messages";

export const CSV_VIEWS = [
  "all",
  "activity",
  "pending",
  "outcomes",
  "rulings",
  "timing",
  "stages",
] as const;

export type CsvView = (typeof CSV_VIEWS)[number];

export function isCsvView(value: string): value is CsvView {
  return (CSV_VIEWS as readonly string[]).includes(value);
}

export function isActivityPeriod(snapshot: DashboardSnapshot, value: string): boolean {
  return activityPeriods(snapshot).includes(value);
}

export function csvFilename(snapshot: DashboardSnapshot, view: CsvView, period: string): string {
  const scope = view === "activity" ? `${view}-${period}` : view;
  return `oncourts-${scope}-${snapshot.asOf}.csv`;
}

const cell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

/**
 * One row per measure, with its unit, a note on what the source does and does not
 * say, the observation date and the source URL. Missing values stay empty, never 0.
 * Prefixed with a BOM so spreadsheet apps read the Malayalam as UTF-8.
 */
export function snapshotCsv(
  snapshot: DashboardSnapshot,
  t: Messages,
  view: CsvView,
  period: string
): string {
  const rows: (string | number)[][] = [
    [
      t["dashboard.csv.section"],
      t["dashboard.activity.period"],
      t["dashboard.timing.table.measure"],
      t["dashboard.timing.table.value"],
      t["dashboard.csv.unit"],
      t["dashboard.csv.note"],
      t["dashboard.csv.observedOn"],
      t["dashboard.csv.source"],
    ],
  ];
  const add = (
    section: string,
    periodLabel: string,
    measure: string,
    value: number | null,
    unit: string,
    note = ""
  ) => rows.push([section, periodLabel, measure, value ?? "", unit, note, snapshot.asOf, snapshot.source]);

  const wants = (v: CsvView) => view === "all" || view === v;
  const snap = t["dashboard.csv.snapshot"];
  const cases = t["dashboard.csv.unit.cases"];
  const percent = t["dashboard.csv.unit.percent"];
  const days = t["dashboard.csv.unit.days"];
  const hearings = t["dashboard.csv.unit.hearings"];
  const { totals, participants, timing } = snapshot;

  if (view === "all") {
    const section = t["dashboard.overview.label"];
    const note = t["dashboard.csv.note.statuses"];
    add(section, snap, t["dashboard.overview.filed.label"], totals.filed, cases, note);
    add(section, snap, t["dashboard.overview.pending.label"], totals.pending, cases, note);
    add(section, snap, t["dashboard.overview.disposed.label"], totals.disposed, cases, note);
    add(section, snap, t["dashboard.csv.scrutiny"], totals.scrutiny, cases, note);
    add(section, snap, t["dashboard.csv.defectCorrection"], totals.defectCorrection, cases, note);
    const people = t["dashboard.people.heading"];
    const unit = t["dashboard.csv.unit.people"];
    add(people, snap, t["dashboard.people.advocates"], participants.advocates, unit);
    add(people, snap, t["dashboard.people.litigants"], participants.litigants, unit);
  }

  if (wants("activity")) {
    const section = t["dashboard.activity.heading"];
    const series = snapshot.quarters.reduce((sum, q) => sum + (q.disposed ?? 0), 0);
    const seriesNote =
      series === totals.disposed
        ? ""
        : fill(t["dashboard.csv.note.series"], { series, headline: totals.disposed });
    for (const q of quartersFor(snapshot, view === "all" ? "all" : period)) {
      const label = quarterLabel(t, q);
      const partial = q.partial ? t["dashboard.activity.partial"] : "";
      add(section, label, t["dashboard.activity.filed"], q.filed, cases, partial);
      const disposedNote = [partial, q.disposed === null ? t["dashboard.notReported"] : "", seriesNote]
        .filter(Boolean)
        .join("; ");
      add(section, label, t["dashboard.activity.disposed"], q.disposed, cases, disposedNote);
    }
  }

  if (wants("pending")) {
    const section = t["dashboard.pending.table.heading"];
    const note = fill(t["dashboard.csv.note.denominator"], { count: totals.pending });
    for (const s of snapshot.stages) {
      const label = stageLabel(t, s.id);
      add(section, snap, label, s.count, cases);
      add(section, snap, label, Number(pendingShare(snapshot, s.count).toFixed(1)), percent, note);
    }
  }

  if (wants("outcomes")) {
    const section = t["dashboard.outcomes.table.all"];
    for (const o of snapshot.outcomes) {
      add(section, snap, outcomeLabel(t, o.id), o.share, percent, t["dashboard.csv.note.outcomes"]);
    }
  }

  if (wants("rulings")) {
    const section = t["dashboard.outcomes.tab.rulings"];
    const total = snapshot.rulings.reduce((sum, r) => sum + r.count, 0);
    const note = fill(t["dashboard.csv.note.rulings"], { count: total });
    for (const r of snapshot.rulings) add(section, snap, outcomeLabel(t, r.id), r.count, cases, note);
  }

  if (wants("timing")) {
    const section = t["dashboard.timing.table.overview"];
    const note = t["dashboard.csv.note.overallTiming"];
    add(section, snap, t["dashboard.timing.daysToDisposal"], timing.daysToDisposal, days, note);
    add(section, snap, t["dashboard.timing.excludingMediation"], timing.daysExcludingMediation, days, note);
    add(section, snap, t["dashboard.timing.hearingsToDisposal"], timing.hearingsToDisposal, hearings, note);
    add(section, snap, t["dashboard.timing.betweenHearings"], timing.daysBetweenHearings, days, note);
  }

  if (wants("stages")) {
    const section = t["dashboard.timing.table.stages"];
    const note = t["dashboard.csv.note.stageTiming"];
    for (const s of snapshot.stageTiming) {
      const label = stageLabel(t, s.id);
      add(section, snap, label, s.days, days, note);
      add(section, snap, label, s.hearings, hearings, [note, s.hearings === null ? t["dashboard.notReported"] : ""].filter(Boolean).join("; "));
    }
  }

  return `\uFEFF${rows.map((row) => row.map(cell).join(",")).join("\r\n")}`;
}
