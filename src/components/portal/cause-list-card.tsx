import type { StaticImageData } from "next/image";

import { Photo } from "@/components/portal/photo";

import { Button } from "@/components/ui/button";
import type { CourtDate } from "@/lib/dates";

/**
 * The homepage's lead service. Sits on the brand primary, so its action is pinned
 * to the primary pair rather than the themed card.
 */
export function CauseListCard({
  image,
  date,
  heading,
  body,
  actionLabel,
  actionHref,
}: {
  image: StaticImageData;
  date: CourtDate;
  heading: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-raised">
      <div className="relative h-54 shrink-0">
        <Photo
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 650px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-6 p-6 lg:p-8">
        <div className="flex flex-col gap-3">
          <p className="type-nav">
            <time dateTime={date.iso}>{date.label}</time>
          </p>
          <h3 className="type-feature">{heading}</h3>
          <p className="type-body max-w-md text-primary-foreground">{body}</p>
        </div>
        <Button
          asChild
          size="lg"
          className="type-action self-start bg-primary-foreground text-primary hover:bg-accent focus-visible:ring-primary-foreground"
        >
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      </div>
    </article>
  );
}
