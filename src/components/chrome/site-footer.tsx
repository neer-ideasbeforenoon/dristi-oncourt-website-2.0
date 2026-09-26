import { focusRingOnCanvas } from "@/components/portal/focus";
import { footerUpdatedOn } from "@/lib/dates";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { href, type RouteName } from "@/lib/routes";
import { cn } from "@/lib/utils";

type FooterLink =
  | { route: RouteName; label: keyof Messages }
  | { href: string; label: keyof Messages };

/**
 * Same destinations as the footer on oncourts.kerala.gov.in. Internal paths follow
 * that site; the support form, user manual, and court sites leave this portal.
 */
const COLUMNS: { id: string; heading: keyof Messages; links: FooterLink[] }[] = [
  {
    id: "footer-quick",
    heading: "footer.quickLinks",
    links: [
      { route: "about", label: "footer.about" },
      { route: "videoTutorials", label: "footer.videos" },
      { route: "mediaGallery", label: "footer.mediaGallery" },
    ],
  },
  {
    id: "footer-help",
    heading: "footer.helpResources",
    links: [
      { href: "https://forms.gle/uCSgGiqGiMQYjjgeA", label: "footer.supportForm" },
      {
        href: "https://oncourts.kerala.gov.in/minio-filestore/v1/files/id?tenantId=kl&fileStoreId=c21569cd-70f1-4a00-b244-afb0cdaf9da5",
        label: "footer.userManual",
      },
      { route: "contact", label: "footer.contact" },
      { route: "faqs", label: "footer.faqs" },
    ],
  },
  {
    id: "footer-information",
    heading: "footer.information",
    links: [
      { route: "rti", label: "footer.rti" },
      { route: "terms", label: "footer.terms" },
      { route: "privacy", label: "footer.privacy" },
    ],
  },
  {
    id: "footer-external",
    heading: "footer.external",
    links: [
      { href: "https://kollam.dcourts.gov.in/", label: "footer.kollamCourt" },
      { href: "https://highcourt.kerala.gov.in/", label: "footer.highCourt" },
      { href: "https://www.sci.gov.in/", label: "footer.supremeCourt" },
      { href: "https://njdg.ecourts.gov.in/njdg_v3/", label: "footer.njdg" },
    ],
  },
];

function isExternal(link: FooterLink): link is { href: string; label: keyof Messages } {
  return "href" in link;
}

export function SiteFooter({ locale, t }: { locale: Locale; t: Messages }) {
  const updated = footerUpdatedOn();

  return (
    <footer className="bg-brand-canvas-deep text-brand-canvas-foreground">
      <div className="mx-auto flex max-w-[var(--portal-content-max)] flex-col gap-12 px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-[minmax(10rem,14rem)_repeat(4,minmax(0,1fr))] xl:gap-10">
          <div className="sm:col-span-2 xl:col-span-1">
            <p className="type-card">{t["footer.name"]}</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.id} aria-labelledby={column.id}>
              <h2 id={column.id} className="type-eyebrow">
                {t[column.heading]}
              </h2>
              <ul className="mt-2 flex flex-col">
                {column.links.map((link) => {
                  const external = isExternal(link);
                  return (
                    <li key={link.label}>
                      <a
                        href={external ? link.href : href(locale, link.route)}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={cn(
                          "type-support flex min-h-10 items-center text-brand-canvas-muted-foreground underline-offset-4 hover:text-brand-canvas-foreground hover:underline",
                          focusRingOnCanvas
                        )}
                      >
                        {t[link.label]}
                        {external ? <span className="sr-only"> ({t["footer.newTab"]})</span> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
        <div className="type-caption border-t border-brand-canvas-foreground/20 pt-6 text-brand-canvas-muted-foreground">
          <p>
            {t["footer.copyright"]}{" "}
            <time dateTime={updated.iso}>{updated.label}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}
