"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { MobileNav } from "@/components/chrome/mobile-nav";
import { focusRing } from "@/components/portal/focus";
import { activeNavHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

/**
 * Desktop row plus the narrow-screen disclosure. Client-only so the active
 * item can follow `usePathname` and the URL hash (for in-page targets like
 * Services) without forcing the locale layout dynamic.
 */
export function HeaderNav({
  navLabel,
  openLabel,
  closeLabel,
  menuTitle,
  links,
}: {
  navLabel: string;
  openLabel: string;
  closeLabel: string;
  menuTitle: string;
  links: NavLink[];
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const current = activeNavHref(
    links.map((link) => link.href),
    pathname,
    hash
  );
  const resolved = links.map((link) => ({
    ...link,
    active: link.href === current,
  }));

  return (
    <>
      <nav aria-label={navLabel} className="hidden min-w-0 flex-1 md:block">
        <ul className="flex justify-end gap-6">
          {resolved.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "type-nav inline-flex min-h-10 items-center whitespace-nowrap text-foreground hover:text-primary",
                  link.active && "text-primary",
                  focusRing
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <MobileNav
        openLabel={openLabel}
        closeLabel={closeLabel}
        title={menuTitle}
        navLabel={navLabel}
        links={resolved}
      />
    </>
  );
}
