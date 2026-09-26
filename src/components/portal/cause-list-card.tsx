import type { StaticImageData } from "next/image";

import { Photo } from "@/components/portal/photo";

import { Button } from "@/components/ui/button";
import type { CourtDate } from "@/lib/dates";

/**
 * The homepage's lead service. Sits on the brand canvas, which is identical in light
 * and dark, so its action is pinned to the canvas pair rather than the themed card.
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
    <article className="flex flex-col overflow-hidden rounded-2xl bg-brand-canvas text-brand-canvas-foreground shadow-raised">
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
          <p className="type-body max-w-md text-brand-canvas-muted-foreground">{body}</p>
        </div>
        <Button
          asChild
          size="lg"
          className="type-action self-start bg-brand-canvas-foreground text-brand-canvas hover:bg-brand-canvas-muted-foreground focus-visible:ring-brand-canvas-foreground"
        >
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      </div>
    </article>
  );
}
