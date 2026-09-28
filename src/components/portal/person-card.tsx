import type { StaticImageData } from "next/image";

import { Photo } from "@/components/portal/photo";
import { Card } from "@/components/ui/card";

/**
 * A judicial officer or court leader: portrait, organisation, name, role. The portrait
 * is decorative because the name beside it identifies the person.
 */
export function PersonCard({
  portrait,
  organisation,
  name,
  role,
  note,
}: {
  portrait: StaticImageData;
  organisation: string;
  name: string;
  role: string;
  note?: string;
}) {
  return (
    <Card className="gap-0 rounded-2xl py-0 sm:min-h-68 sm:flex-row">
      <div className="relative aspect-[4/3] shrink-0 bg-brand-muted sm:aspect-auto sm:w-50">
        <Photo
          src={portrait}
          alt=""
          fill
          sizes="(min-width: 640px) 200px, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6 p-6">
        <p className="type-eyebrow flex-1 text-muted-foreground">{organisation}</p>
        <div className="flex flex-col gap-1">
          <h3 className="type-card text-foreground">{name}</h3>
          <p className="type-support text-muted-foreground">{role}</p>
          {note ? <p className="type-caption pt-3 text-muted-foreground">{note}</p> : null}
        </div>
      </div>
    </Card>
  );
}
