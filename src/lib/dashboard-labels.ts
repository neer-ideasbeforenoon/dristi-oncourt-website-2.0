import type {
  OutcomeId,
  PendingStageId,
  Quarter,
  TimingStageId,
} from "@/lib/dashboard-snapshot";
import type { Messages } from "@/lib/i18n/messages";

/** "Oct–Dec 2024", in the reader's language. */
export function quarterLabel(t: Messages, q: Quarter): string {
  return `${t[`dashboard.quarter.${q.quarter}` as const]} ${q.year}`;
}

export function stageLabel(t: Messages, id: PendingStageId | TimingStageId): string {
  return t[`dashboard.stage.${id}` as const];
}

export function outcomeLabel(t: Messages, id: OutcomeId): string {
  return t[`dashboard.outcome.${id}` as const];
}
