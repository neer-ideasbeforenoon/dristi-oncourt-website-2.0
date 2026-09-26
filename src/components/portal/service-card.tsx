import type { StaticImageData } from "next/image";

import { Photo } from "@/components/portal/photo";
import type { LucideIcon } from "lucide-react";

import { ArrowLink } from "@/components/portal/arrow-link";
import { Card } from "@/components/ui/card";

/**
 * A secondary service: photograph, icon, heading, one action. The action's `::after`
 * covers the card, so the whole card is one click target with one accessible name.
 */
export function ServiceCard({
  image,
  icon: Icon,
  heading,
  body,
  actionLabel,
  actionHref,
}: {
  image: StaticImageData;
  icon: LucideIcon;
  heading: string;
  body: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <Card className="relative flex-row gap-0 rounded-2xl py-0 transition-shadow has-[a:hover]:shadow-overlay">
      <div className="relative hidden w-1/3 max-w-44 shrink-0 sm:block">
        <Photo src={image} alt="" fill sizes="176px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden p-6">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-28 -right-14 size-44 rounded-full border border-hairline"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-26 -right-11 size-40 rounded-full border border-hairline"
        />
        <div className="flex flex-col gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand-muted text-brand-muted-foreground">
            <Icon aria-hidden className="size-4.5" />
          </span>
          <h3 className="type-card text-foreground">{heading}</h3>
          <p className="type-support text-muted-foreground">{body}</p>
        </div>
        <ArrowLink href={actionHref} className="text-primary after:absolute after:inset-0">
          {actionLabel}
        </ArrowLink>
      </div>
    </Card>
  );
}
