import { focusRing } from "@/components/portal/focus";
import { cn } from "@/lib/utils";

/**
 * Below `md` the header links live in this disclosure. It is a native
 * `<details>` control, so it opens without a client script and stays inside
 * the first-load budget. From `md` up the same destinations sit in the header row.
 */
export function MobileNav({
  openLabel,
  closeLabel,
  title,
  navLabel,
  links,
}: {
  openLabel: string;
  closeLabel: string;
  title: string;
  navLabel: string;
  links: { href: string; label: string }[];
}) {
  return (
    <details className="group md:hidden">
      <summary
        className={cn(
          "flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-input bg-card [&::-webkit-details-marker]:hidden",
          focusRing
        )}
      >
        <MenuGlyph />
        <CloseGlyph />
        <span className="sr-only group-open:hidden">{openLabel}</span>
        <span className="sr-only hidden group-open:inline">{closeLabel}</span>
      </summary>
      <nav
        aria-label={navLabel}
        className="absolute inset-x-0 top-full z-50 border-t border-hairline bg-background px-4 py-2 shadow-overlay"
      >
        <p className="type-action px-3 py-2">{title}</p>
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "type-nav flex min-h-12 items-center rounded-lg px-3 text-foreground hover:bg-accent",
                  focusRing
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}

function MenuGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 group-open:hidden" aria-hidden="true" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="hidden size-5 group-open:block"
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
