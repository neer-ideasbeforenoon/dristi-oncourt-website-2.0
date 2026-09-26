import { ArrowRight } from "lucide-react";

import { focusRing } from "@/components/portal/focus";
import { cn } from "@/lib/utils";

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "type-action group/arrow inline-flex min-h-10 items-center gap-2 self-start underline-offset-4 hover:underline",
        focusRing,
        className
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform group-hover/arrow:translate-x-0.5"
      />
    </a>
  );
}
