import type { StaticImageData } from "next/image";

import { ArrowLink } from "@/components/portal/arrow-link";
import { Photo } from "@/components/portal/photo";
import { cn } from "@/lib/utils";

type Action = { label: string; href: string };

/**
 * One numbered choice on the services page. Resting, it is a white card on the beige canvas.
 * Hover and keyboard focus fill it with the brand primary. With a single action,
 * that action's `::after` covers the card, so the whole card is one click target.
 * With two, each link stands alone, because a stretched link would swallow the other.
 */
export function ServiceChoiceCard({
  image,
  number,
  category,
  heading,
  body,
  actions,
  newTab,
}: {
  image: StaticImageData;
  number: number;
  category: string;
  heading: string;
  body: string;
  actions: [Action] | [Action, Action];
  newTab: string;
}) {
  const stretched = actions.length === 1;

  return (
    <article
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border border-hairline bg-card text-foreground transition-[color,background-color,border-color,box-shadow] duration-200",
        "hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-overlay",
        "focus-within:border-primary focus-within:bg-primary focus-within:text-primary-foreground focus-within:shadow-overlay"
      )}
    >
      <div className="relative h-37.5 shrink-0">
        <Photo src={image} alt="" fill sizes="(min-width: 1024px) 388px, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-6 px-6 pt-5.5 pb-4">
        <div className="flex flex-col gap-3">
          <p className="type-eyebrow text-primary transition-colors duration-200 group-hover:text-primary-foreground group-focus-within:text-primary-foreground">
            <span aria-hidden>{String(number).padStart(2, "0")} / </span>
            {category}
          </p>
          <div className="flex flex-col gap-2">
            <h3 className="type-card text-foreground transition-colors duration-200 group-hover:text-primary-foreground group-focus-within:text-primary-foreground">
              {heading}
            </h3>
            <p className="type-support text-muted-foreground transition-colors duration-200 group-hover:text-primary-foreground group-focus-within:text-primary-foreground">
              {body}
            </p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-1">
          {actions.map((action) => (
            <ArrowLink
              key={action.href}
              href={action.href}
              newTab={newTab}
              className={cn(
                "text-foreground transition-colors duration-200 group-hover:text-primary-foreground group-focus-within:text-primary-foreground",
                "focus-visible:ring-primary-foreground",
                stretched && "after:absolute after:inset-0"
              )}
            >
              {action.label}
            </ArrowLink>
          ))}
        </div>
      </div>
    </article>
  );
}
