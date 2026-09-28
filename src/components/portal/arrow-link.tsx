import { ArrowRight, ArrowUpRight } from "lucide-react";

import { focusRing } from "@/components/portal/focus";
import { cn } from "@/lib/utils";

/**
 * Pass `newTab` (the localised "opens in a new tab") for a link that leaves this
 * portal: it opens in a new tab, points up and out, and says so to screen readers.
 */
export function ArrowLink({
  href,
  children,
  className,
  newTab,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  newTab?: string;
}) {
  const Icon = newTab ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "type-action group/arrow inline-flex min-h-10 items-center gap-2 self-start underline-offset-4 hover:underline",
        focusRing,
        className
      )}
    >
      {children}
      {newTab ? <span className="sr-only"> ({newTab})</span> : null}
      <Icon
        aria-hidden
        className={cn(
          "size-4 shrink-0 transition-transform",
          newTab
            ? "group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5"
            : "group-hover/arrow:translate-x-0.5"
        )}
      />
    </a>
  );
}
