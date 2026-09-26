import { ChevronDown } from "lucide-react";

import logo from "@/assets/home/logo.png";
import { MobileNav } from "@/components/chrome/mobile-nav";
import { focusRing } from "@/components/portal/focus";
import { Photo } from "@/components/portal/photo";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { href, type RouteName } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV: { route: RouteName; label: keyof Messages }[] = [
  { route: "home", label: "nav.home" },
  { route: "about", label: "nav.about" },
  { route: "services", label: "nav.services" },
  { route: "dashboard", label: "nav.dashboard" },
  { route: "support", label: "nav.support" },
];

/**
 * From `md` up the links sit in the header row. Below that they move into
 * `MobileNav`, so a narrow screen does not clip "Support".
 */
export function SiteHeader({ locale, t }: { locale: Locale; t: Messages }) {
  const links = NAV.map(({ route, label }) => ({
    href: href(locale, route),
    label: t[label],
  }));

  return (
    <header className="relative border-b border-hairline bg-background">
      <a
        href="#main"
        className="type-action sr-only rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        {t["chrome.skipToContent"]}
      </a>
      <div className="mx-auto flex max-w-[var(--portal-content-max)] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href={href(locale, "home")}
          className={cn("flex shrink-0 items-center gap-3", focusRing)}
        >
          <Photo src={logo} alt={t["chrome.logoAlt"]} loading="eager" className="h-12 w-auto" />
        </a>

        <nav aria-label={t["chrome.navLabel"]} className="hidden min-w-0 flex-1 md:block">
          <ul className="flex justify-end gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "type-nav inline-flex min-h-10 items-center whitespace-nowrap text-foreground hover:text-primary",
                    focusRing
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <MobileNav
            openLabel={t["chrome.openMenu"]}
            closeLabel={t["chrome.closeMenu"]}
            title={t["chrome.menuTitle"]}
            navLabel={t["chrome.navLabel"]}
            links={links}
          />
          <Button asChild size="lg" className="type-action">
            <a href={href(locale, "login")}>
              {t["nav.login"]}
              <ChevronDown aria-hidden data-icon="inline-end" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
