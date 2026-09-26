/**
 * A fixed snapshot of the public dashboard, shown on the homepage.
 *
 * These are the figures from the design handoff, not live data. When the dashboard
 * service is wired up, fetch it in a server component and return this same shape, so
 * the figures stay in the server HTML.
 */
export type QuarterFiling = {
  label: string;
  count: number;
  /** The quarter still in progress. Rendered as the emphasised bar. */
  toDate?: boolean;
};

export type DashboardSnapshot = {
  /** ISO date the figures were taken. */
  asOf: string;
  filed: { total: number; byQuarter: QuarterFiling[] };
  disposed: {
    total: number;
    /** Rounded percentages of disposed cases. */
    withdrawn: number;
    dismissed: number;
    other: number;
  };
  hearingGapDays: number;
};

export const DASHBOARD_SNAPSHOT: DashboardSnapshot = {
  asOf: "2026-09-26",
  filed: {
    total: 2342,
    byQuarter: [
      { label: "Q4 ’25", count: 194 },
      { label: "Q1 ’26", count: 461 },
      { label: "Q2 ’26", count: 486 },
      { label: "Q3 ’26*", count: 458, toDate: true },
    ],
  },
  disposed: { total: 481, withdrawn: 76, dismissed: 14, other: 10 },
  hearingGapDays: 18,
};
