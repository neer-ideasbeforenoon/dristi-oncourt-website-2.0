import Link from "next/link";

import { navLink } from "@/components/chrome/styles";
import type { Locale } from "@/lib/i18n/config";
import { FOOTER_NAV } from "@/lib/navigation";
import { helplineHref } from "@/lib/site";
import type { Messages } from "@/lib/i18n/messages";

export function SiteFooter({
  locale,
  t,
  helpline,
}: {
  locale: Locale;
  t: Messages;
  helpline: string | null;
}) {
  const phone = helplineHref(helpline);

  return (
    <footer className="border-border mt-12 border-t">
      <div className="mx-auto flex w-full max-w-[var(--portal-content-max)] flex-col gap-4 px-4 py-8">
        <nav aria-label={t["footer.institution"]}>
          <ul className="flex flex-wrap gap-1">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <Link href={`/${locale}${item.href}`} className={`${navLink} hover:bg-accent`}>
                  {t[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {phone && helpline ? (
          <a href={phone} className={navLink}>
            {t["home.helpline.heading"]}
            <span className="text-muted-foreground ms-2">{helpline}</span>
          </a>
        ) : null}
      </div>
    </footer>
  );
}
