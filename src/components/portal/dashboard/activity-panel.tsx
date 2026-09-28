"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

import { focusRing } from "@/components/portal/focus";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { cn } from "@/lib/utils";

import { DashboardPanel } from "./dashboard-panel";

export type ActivityQuarter = {
  /** Position in the full series; stable across period filters. */
  index: number;
  year: number;
  months: string;
  label: string;
  filed: number;
  disposed: number | null;
  partial: boolean;
  /** Accessible name for the quarter's bar group. */
  aria: string;
  /** "Complete quarter", "Last complete quarter" or "In progress…". */
  status: string;
};

export type ActivityLabels = {
  kicker: string;
  heading: string;
  description: string;
  period: string;
  periods: { value: string; label: string }[];
  filed: string;
  disposed: string;
  partial: string;
  notReported: string;
  hint: string;
  swipe: string;
  chartLabel: string;
  chartTitle: string;
  chartDesc: string;
  chartDescPartial: string;
};

const VIEW = { width: 700, height: 262 };
const PLOT = { x: 40, y: 22, width: 650, height: 184 };
const BASELINE = PLOT.y + PLOT.height;
const AXIS_LINE = 17;

/**
 * Filings and disposals by quarter. The period filter scopes this chart and its table
 * only; lifetime totals and pending stages elsewhere on the page do not change with it.
 *
 * One zero-based scale across every period, so a year's bars can be compared with the
 * full series. An incomplete quarter is hatched; a missing disposal is a dashed stub,
 * never a zero-height bar.
 */
export function ActivityPanel({
  id,
  quarters,
  initialIndex,
  scaleMax,
  htmlLang,
  labels,
}: {
  id: string;
  quarters: ActivityQuarter[];
  initialIndex: number;
  scaleMax: number;
  htmlLang: string;
  labels: ActivityLabels;
}) {
  const [period, setPeriod] = useState("all");
  const [selected, setSelected] = useState(initialIndex);
  const groups = useRef(new Map<number, SVGGElement>());
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const number = new Intl.NumberFormat(htmlLang);

  const visible = period === "all" ? quarters : quarters.filter((q) => String(q.year) === period);
  const active = visible.some((q) => q.index === selected)
    ? selected
    : visible[visible.length - 1].index;
  const current = quarters[active];
  const hasPartial = visible.some((q) => q.partial);
  const missing = visible.filter((q) => q.disposed === null);

  // Malayalam month ranges are wider than a quarter's column at any zoom (the label
  // scales with the chart), so they break at the range dash onto two lines.
  const stackMonths = htmlLang.startsWith("ml");
  const viewHeight = VIEW.height + (stackMonths ? AXIS_LINE : 0);
  const axisLines = (q: ActivityQuarter) => {
    const months = q.partial ? `${q.months}*` : q.months;
    const [start, end] = months.split("–");
    return stackMonths && end ? [`${start}–`, end] : [months];
  };

  const step = PLOT.width / visible.length;
  const barWidth = Math.min(24, step * 0.26);
  const y = (value: number) => BASELINE - (value / scaleMax) * PLOT.height;
  const ticks = Array.from({ length: scaleMax / 100 + 1 }, (_, i) => i * 100);
  const hatch = { filed: `${uid}-hatch-filed`, disposed: `${uid}-hatch-disposed` };

  const select = (index: number, focus = false) => {
    setSelected(index);
    if (focus) groups.current.get(index)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, position: number) => {
    const last = visible.length - 1;
    const next =
      event.key === "ArrowRight" ? (position + 1) % visible.length
      : event.key === "ArrowLeft" ? (position - 1 + visible.length) % visible.length
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next !== null) {
      event.preventDefault();
      select(visible[next].index, true);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(visible[position].index);
    }
  };

  return (
    <DashboardPanel
      id={id}
      kicker={labels.kicker}
      heading={labels.heading}
      description={labels.description}
      action={
        <div className="flex items-center gap-2">
          <Label htmlFor={`${id}-period`} className="type-caption font-bold text-muted-foreground">
            {labels.period}
          </Label>
          <NativeSelect
            id={`${id}-period`}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            {labels.periods.map((p) => (
              <NativeSelectOption key={p.value} value={p.value}>
                {p.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ul className="type-caption flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-xs bg-chart-1" />
              {labels.filed}
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-2.5 rounded-xs bg-chart-4" />
              {labels.disposed}
            </li>
            {hasPartial ? (
              <li className="flex items-center gap-2">
                <svg aria-hidden viewBox="0 0 10 10" className="size-2.5">
                  <rect width="10" height="10" fill={`url(#${hatch.filed})`} className="stroke-chart-1" strokeWidth={1.5} />
                </svg>
                {labels.partial}
              </li>
            ) : null}
            {missing.length ? (
              <li className="flex items-center gap-2">
                <svg aria-hidden viewBox="0 0 10 10" className="size-2.5">
                  <rect x="1" y="1" width="8" height="8" fill="none" className="stroke-chart-4" strokeWidth={1.5} strokeDasharray="2 1.5" />
                </svg>
                {labels.notReported}
              </li>
            ) : null}
          </ul>
          <p className="type-caption hidden text-muted-foreground lg:block">{labels.hint}</p>
        </div>
        <p className="type-caption text-muted-foreground sm:hidden">{labels.swipe}</p>

        <div
          role="region"
          aria-label={labels.chartLabel}
          tabIndex={0}
          className={cn("-mx-1 overflow-x-auto px-1", focusRing)}
        >
          <svg
            viewBox={`0 0 ${VIEW.width} ${viewHeight}`}
            aria-labelledby={`${uid}-title ${uid}-desc`}
            className="block h-auto w-full min-w-142 overflow-visible"
          >
            <title id={`${uid}-title`}>{labels.chartTitle}</title>
            <desc id={`${uid}-desc`}>
              {hasPartial ? `${labels.chartDesc} ${labels.chartDescPartial}` : labels.chartDesc}
            </desc>
            <defs>
              <pattern id={hatch.filed} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                <rect width="2.5" height="5" className="fill-chart-1" />
              </pattern>
              <pattern id={hatch.disposed} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
                <rect width="2.5" height="5" className="fill-chart-4" />
              </pattern>
            </defs>

            {ticks.map((tick) => (
              <g key={tick} aria-hidden>
                <line x1={PLOT.x} x2={PLOT.x + PLOT.width} y1={y(tick)} y2={y(tick)} className="stroke-hairline" />
                <text x={PLOT.x - 8} y={y(tick) + 4} textAnchor="end" className="type-caption fill-muted-foreground">
                  {number.format(tick)}
                </text>
              </g>
            ))}

            {visible.map((q, position) => {
              const cx = PLOT.x + step * (position + 0.5);
              const bars = [
                { key: "filed" as const, x: cx - barWidth - 2, value: q.filed, fillClass: "fill-chart-1", strokeClass: "stroke-chart-1" },
                { key: "disposed" as const, x: cx + 2, value: q.disposed, fillClass: "fill-chart-4", strokeClass: "stroke-chart-4" },
              ];
              const isActive = q.index === active;
              return (
                <g
                  key={q.index}
                  ref={(node) => {
                    if (node) groups.current.set(q.index, node);
                    else groups.current.delete(q.index);
                  }}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-pressed={isActive}
                  aria-label={q.aria}
                  onClick={() => select(q.index)}
                  onKeyDown={(event) => onKeyDown(event, position)}
                  className="group/q cursor-pointer outline-none"
                >
                  <rect
                    x={cx - step * 0.44}
                    y={4}
                    width={step * 0.88}
                    height={viewHeight - 8}
                    rx={8}
                    strokeWidth={2}
                    className="fill-transparent stroke-transparent group-hover/q:fill-accent group-aria-pressed/q:fill-accent-strong group-focus-visible/q:stroke-ring"
                  />
                  {bars.map((bar) =>
                    bar.value === null ? (
                      <rect
                        key={bar.key}
                        x={bar.x + 0.75}
                        y={BASELINE - 18}
                        width={barWidth - 1.5}
                        height={17.25}
                        rx={2}
                        fill="none"
                        strokeWidth={1.5}
                        strokeDasharray="3 2"
                        className={bar.strokeClass}
                      />
                    ) : (
                      <g key={bar.key}>
                        <rect
                          x={bar.x}
                          y={y(bar.value)}
                          width={barWidth}
                          height={BASELINE - y(bar.value)}
                          rx={3}
                          fill={q.partial ? `url(#${hatch[bar.key]})` : undefined}
                          strokeWidth={q.partial ? 1.5 : 0}
                          className={q.partial ? bar.strokeClass : bar.fillClass}
                        />
                        <text
                          x={bar.x + barWidth / 2}
                          y={y(bar.value) - 6}
                          textAnchor="middle"
                          className="type-caption fill-foreground font-bold"
                        >
                          {number.format(bar.value)}
                        </text>
                      </g>
                    )
                  )}
                  {axisLines(q).map((line, i) => (
                    <text
                      key={line}
                      x={cx}
                      y={BASELINE + 20 + i * AXIS_LINE}
                      textAnchor="middle"
                      className="type-caption fill-foreground"
                    >
                      {line}
                    </text>
                  ))}
                  <text
                    x={cx}
                    y={BASELINE + 20 + axisLines(q).length * AXIS_LINE}
                    textAnchor="middle"
                    className="type-caption fill-muted-foreground"
                  >
                    {q.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-hairline pt-4"
        >
          <div className="flex flex-col">
            <p className="type-nav text-foreground">{current.label}</p>
            <p className={cn("type-caption", current.partial ? "text-warning-ink" : "text-muted-foreground")}>
              {current.status}
            </p>
          </div>
          <dl className="flex gap-6">
            <div className="flex items-baseline gap-2">
              <dt className="type-caption text-muted-foreground">{labels.filed}</dt>
              <dd className="type-figure-s text-foreground">{number.format(current.filed)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="type-caption text-muted-foreground">{labels.disposed}</dt>
              <dd className={cn(current.disposed === null ? "type-caption text-muted-foreground" : "type-figure-s text-foreground")}>
                {current.disposed === null ? labels.notReported : number.format(current.disposed)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </DashboardPanel>
  );
}
