import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * One dashboard panel: heading block and body.
 *
 * No hooks here: the tabbed and chart panels render this from their client
 * islands, the static ones from the server.
 */
export function DashboardPanel({
  id,
  kicker,
  heading,
  description,
  action,
  className,
  children,
}: {
  id: string;
  kicker: string;
  heading: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn("flex min-w-0", className)}>
      <Card className="min-w-0 flex-1 gap-0 rounded-2xl py-0">
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="type-eyebrow text-primary">{kicker}</p>
              <h2 id={headingId} className="type-panel text-foreground">
                {heading}
              </h2>
              {description ? <p className="type-caption text-muted-foreground">{description}</p> : null}
            </div>
            {action}
          </div>
          {children}
        </div>
      </Card>
    </section>
  );
}
