/**
 * A fixed snapshot of the official public dashboard, shown on the homepage and on
 * /dashboard. Transcribed from https://oncourts.kerala.gov.in/dashboard on the `asOf`
 * date; it does not refresh.
 *
 * When the dashboard service is wired up, fetch it in a server component and return
 * this same shape, so the figures stay in the server HTML.
 *
 * The source measures do not reconcile, and this model does not make them:
 * - filed, pending, disposed, scrutiny and defect correction are independent counts
 *   (the last four sum to 2,327 against 2,347 filings);
 * - the quarterly disposal series sums to 479 against a headline of 484, and has no
 *   value for Oct–Dec 2024. That value is `null`, never 0;
 * - outcome shares are the source's rounded percentages and sum to 99.
 */
export type QuarterNumber = 1 | 2 | 3 | 4;

export type Quarter = {
  year: number;
  quarter: QuarterNumber;
  filed: number;
  /** `null` when the source shows no disposal figure for the quarter. */
  disposed: number | null;
  /** Still in progress on the snapshot date. */
  partial?: boolean;
};

export type PendingStageId = "cognizance" | "appearance" | "bail" | "trial";
export type OutcomeId = "withdrawn" | "dismissed" | "acquitted" | "convicted" | "abated";
export type RulingId = "acquitted" | "convicted";
export type TimingStageId =
  | "registration"
  | "cognizance"
  | "appearance"
  | "bail"
  | "mediation"
  | "trial";

export type DashboardSnapshot = {
  /** ISO date the figures were observed. */
  asOf: string;
  source: string;
  totals: {
    filed: number;
    pending: number;
    disposed: number;
    scrutiny: number;
    defectCorrection: number;
  };
  participants: { advocates: number; litigants: number };
  /** Overall measures. The source does not say whether these are means or medians. */
  timing: {
    daysToDisposal: number;
    daysExcludingMediation: number;
    hearingsToDisposal: number;
    daysBetweenHearings: number;
  };
  quarters: Quarter[];
  /** Current position of every pending case. Sums to `totals.pending`. */
  stages: { id: PendingStageId; count: number }[];
  /** Rounded percentages of disposed cases, as the source reports them. */
  outcomes: { id: OutcomeId; share: number }[];
  /** Contested rulings, a subset of disposed cases. */
  rulings: { id: RulingId; count: number }[];
  /** Medians among cases that completed each stage. Never summed. */
  stageTiming: { id: TimingStageId; days: number; hearings: number | null }[];
};

export const DASHBOARD_SNAPSHOT: DashboardSnapshot = {
  asOf: "2026-09-28",
  source: "https://oncourts.kerala.gov.in/dashboard",
  totals: { filed: 2347, pending: 1811, disposed: 484, scrutiny: 2, defectCorrection: 30 },
  participants: { advocates: 984, litigants: 2124 },
  timing: {
    daysToDisposal: 177,
    daysExcludingMediation: 151,
    hearingsToDisposal: 7,
    daysBetweenHearings: 18,
  },
  quarters: [
    { year: 2024, quarter: 4, filed: 89, disposed: null },
    { year: 2025, quarter: 1, filed: 245, disposed: 13 },
    { year: 2025, quarter: 2, filed: 163, disposed: 37 },
    { year: 2025, quarter: 3, filed: 246, disposed: 53 },
    { year: 2025, quarter: 4, filed: 194, disposed: 105 },
    { year: 2026, quarter: 1, filed: 461, disposed: 98 },
    { year: 2026, quarter: 2, filed: 486, disposed: 88 },
    { year: 2026, quarter: 3, filed: 463, disposed: 85, partial: true },
  ],
  stages: [
    { id: "cognizance", count: 115 },
    { id: "appearance", count: 1005 },
    { id: "bail", count: 370 },
    { id: "trial", count: 321 },
  ],
  outcomes: [
    { id: "withdrawn", share: 76 },
    { id: "dismissed", share: 14 },
    { id: "acquitted", share: 5 },
    { id: "convicted", share: 3 },
    { id: "abated", share: 1 },
  ],
  rulings: [
    { id: "acquitted", count: 24 },
    { id: "convicted", count: 15 },
  ],
  stageTiming: [
    { id: "registration", days: 0, hearings: null },
    { id: "cognizance", days: 0, hearings: 2 },
    { id: "appearance", days: 84, hearings: 3 },
    { id: "bail", days: 68, hearings: 6 },
    { id: "mediation", days: 55, hearings: 2 },
    { id: "trial", days: 128, hearings: 9 },
  ],
};

/**
 * Activity chart periods: "all", then each year newest first. A year with a single
 * quarter (the launch quarter) is not worth a filter of its own.
 */
export function activityPeriods(snapshot: DashboardSnapshot): string[] {
  const perYear = new Map<number, number>();
  for (const q of snapshot.quarters) perYear.set(q.year, (perYear.get(q.year) ?? 0) + 1);
  const years = [...perYear].filter(([, n]) => n > 1).map(([y]) => y).sort((a, b) => b - a);
  return ["all", ...years.map(String)];
}

export function quartersFor(snapshot: DashboardSnapshot, period: string): Quarter[] {
  return period === "all"
    ? snapshot.quarters
    : snapshot.quarters.filter((q) => String(q.year) === period);
}

/** Share of all pending cases, in percent. */
export function pendingShare(snapshot: DashboardSnapshot, count: number): number {
  return (count / snapshot.totals.pending) * 100;
}
