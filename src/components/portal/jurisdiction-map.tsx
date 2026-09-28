"use client";

import { useState, type KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  districtLabel,
  locator,
  places,
  type PlaceId,
  type StationId,
} from "./kollam-map";

function MapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 34" aria-hidden className={cn("h-8 w-6", className)}>
      <path
        fill="currentColor"
        d="M12 0C5.4 0 0 5.4 0 12c0 7.8 12 22 12 22s12-14.2 12-22C24 5.4 18.6 0 12 0z"
      />
      <circle cx="12" cy="12" r="4.2" className="fill-card group-aria-pressed/button:fill-primary" />
    </svg>
  );
}

export function JurisdictionMap({
  eyebrow,
  heading,
  body,
  count,
  countLabel,
  stations,
  mapTitle,
  mapLabel,
  hint,
  stationListLabel,
  stationKind,
  stationSuffix,
  courtName,
  courtKind,
  district,
  caption,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  count: string;
  countLabel: string;
  stations: readonly { id: StationId; name: string }[];
  mapTitle: string;
  mapLabel: string;
  hint: string;
  stationListLabel: string;
  stationKind: string;
  stationSuffix: string;
  courtName: string;
  courtKind: string;
  district: string;
  caption: string;
}) {
  const [selected, setSelected] = useState<PlaceId | null>(null);
  const [hovered, setHovered] = useState<PlaceId | null>(null);

  const names = new Map<PlaceId, string>([
    ...stations.map((station) => [station.id, `${station.name} ${stationSuffix}`] as const),
    ["court", courtName],
  ]);
  const kindFor = (id: PlaceId) => (id === "court" ? courtKind : stationKind);

  function choose(id: PlaceId) {
    setSelected((current) => (current === id ? null : id));
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") setSelected(null);
  }

  return (
    <div className="flex flex-col gap-10" onKeyDown={onKeyDown}>
      <div className="flex max-w-[var(--portal-measure)] flex-col gap-4">
        <p className="type-eyebrow text-primary">{eyebrow}</p>
        <h2 id="jurisdiction-heading" className="type-services text-balance text-foreground">
          {heading}
        </h2>
        <p className="type-body pt-2 text-muted-foreground">{body}</p>
        <p className="mt-4 flex items-center gap-4 rounded-xl border border-hairline bg-card px-6 py-4">
          <span className="type-section shrink-0 text-foreground">{count}</span>
          <span className="type-caption text-muted-foreground">{countLabel}</span>
        </p>
        <ul className="flex flex-wrap gap-2" aria-label={stationListLabel}>
          {stations.map((station) => {
            const pressed = selected === station.id;
            const hot = hovered === station.id && !pressed;
            return (
              <li key={station.id}>
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={pressed}
                  className={cn(
                    "type-caption h-10 rounded-full px-3",
                    "aria-pressed:border-transparent aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary-hover",
                    hot && "bg-accent text-foreground",
                  )}
                  onClick={() => choose(station.id)}
                  onMouseEnter={() => setHovered(station.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(station.id)}
                  onBlur={() => setHovered(null)}
                >
                  {station.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      <figure className="flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-4 shadow-raised sm:p-6">
        <p className="type-lead text-center text-muted-foreground">{mapTitle}</p>
        <div className="overflow-x-auto">
          <div
            className="relative w-full min-w-[56rem]"
            style={{ aspectRatio: `${locator.width} / ${locator.height}` }}
            role="group"
            aria-label={mapLabel}
          >
            <svg
              aria-hidden
              focusable="false"
              viewBox={`0 0 ${locator.width} ${locator.height}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={locator.path}
                className="fill-surface-sunken stroke-border"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <p
              className="type-figure pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-muted-foreground"
              style={{
                left: `${(districtLabel.x / locator.width) * 100}%`,
                top: `${(districtLabel.y / locator.height) * 100}%`,
              }}
            >
              {district}
            </p>

            {places.map((place) => {
              const pressed = selected === place.id;
              const hot = hovered === place.id && !pressed;
              const court = place.kind === "court";
              const name = names.get(place.id) ?? "";
              return (
                <button
                  key={place.id}
                  type="button"
                  aria-pressed={pressed}
                  aria-label={court ? name : undefined}
                  className={cn(
                    "absolute z-10 flex size-10 -translate-x-1/2 -translate-y-full items-end justify-center rounded-full",
                    "outline-none focus-visible:z-30 focus-visible:ring-3 focus-visible:ring-focus-ring",
                    pressed && "z-20",
                  )}
                  style={{
                    left: `${(place.x / locator.width) * 100}%`,
                    top: `${(place.y / locator.height) * 100}%`,
                  }}
                  onClick={() => choose(place.id)}
                  onMouseEnter={() => setHovered(place.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(place.id)}
                  onBlur={() => setHovered(null)}
                >
                  <MapPin
                    className={cn(
                      court || pressed ? "text-primary" : "text-foreground",
                      hot && "scale-110",
                      "transition-transform motion-reduce:transition-none",
                    )}
                  />
                  {place.label === "none" ? null : (
                    <span
                      className={cn(
                        "type-caption absolute top-0 whitespace-nowrap rounded-md border border-hairline bg-card px-1.5 py-0.5 text-foreground shadow-raised",
                        place.label === "right" ? "left-full ml-0.5" : "right-full mr-0.5",
                        pressed && "border-transparent bg-primary text-primary-foreground",
                        hot && !pressed && "bg-accent",
                      )}
                    >
                      {name}
                    </span>
                  )}
                </button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              aria-pressed={selected === "court"}
              className="type-caption absolute bottom-3 left-3 z-20 h-10 gap-2 rounded-full border-hairline bg-card px-3 text-primary shadow-raised aria-pressed:border-transparent aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary-hover"
              onClick={() => choose("court")}
              onMouseEnter={() => setHovered("court")}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered("court")}
              onBlur={() => setHovered(null)}
            >
              <MapPin className="size-5" />
              {courtName}
            </Button>
          </div>
        </div>

        <div aria-live="polite" className="min-h-12 px-1">
          {selected ? (
            <>
              <p className="type-support text-foreground">{names.get(selected)}</p>
              <p className="type-caption text-muted-foreground">{kindFor(selected)}</p>
            </>
          ) : (
            <p className="type-caption text-muted-foreground">{hint}</p>
          )}
        </div>

        <figcaption className="type-caption px-1 text-muted-foreground">{caption}</figcaption>
      </figure>
    </div>
  );
}
