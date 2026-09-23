import type { Messages } from "@/lib/i18n/messages";

/**
 * Header order for every state site. This is the lock in docs/ia.md.
 * Reordering it is a change to that document, not a local tweak.
 */
export const PRIMARY_NAV = [
  { href: "/cause-list", key: "nav.causeList" },
  { href: "/search", key: "nav.caseSearch" },
  { href: "/login", key: "nav.login" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/notices", key: "nav.notices" },
  { href: "/certified-copies", key: "nav.certifiedCopies" },
  { href: "/help", key: "nav.help" },
] as const satisfies readonly { href: string; key: keyof Messages }[];

/** Footer. Institutional pages, off the service path. */
export const FOOTER_NAV = [
  { href: "/about", key: "nav.about" },
  { href: "/rti", key: "nav.rti" },
  { href: "/policies", key: "nav.policies" },
] as const satisfies readonly { href: string; key: keyof Messages }[];
