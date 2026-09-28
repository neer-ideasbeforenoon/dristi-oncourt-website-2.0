import { cn } from "@/lib/utils";

/**
 * A horizontal bar for a share or a scaled value. Decorative: every bar sits beside
 * text that states the same number, so the bar is hidden from assistive technology.
 * `emphasis` marks the row the panel is drawing attention to, never a status.
 */
export function ShareBar({
  value,
  max = 100,
  emphasis = false,
  className,
}: {
  value: number;
  max?: number;
  emphasis?: boolean;
  className?: string;
}) {
  const width = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span aria-hidden className={cn("block h-2.5 overflow-hidden rounded-xs bg-track", className)}>
      <span
        className={cn(
          "block h-full rounded-xs motion-safe:transition-[width] motion-safe:duration-300",
          emphasis ? "bg-chart-1" : "bg-brand-accent"
        )}
        style={{ width: `${width}%` }}
      />
    </span>
  );
}
