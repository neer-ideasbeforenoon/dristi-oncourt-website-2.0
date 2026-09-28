import type { Locale } from "@/lib/i18n/config";

/**
 * Every internal link target, in one place. Paths follow the routes of the portal being
 * replaced (see docs/current-site-audit.md). Most of these pages are not built yet, so
 * the links resolve to the locale 404 until they are.
 */
const PATHS = {
  home: "",
  services: "/services",
  about: "/about",
  dashboard: "/dashboard",
  support: "/support",
  login: "/login",
  causeList: "/live-causelist",
  caseSearch: "/search",
  certifiedCopies: "/certified-true-copies",
  certifiedCopiesApply: "/certified-true-copies/apply",
  certifiedCopiesStatus: "/certified-true-copies/view-status-application",
  help: "/support/faqs",
  videoTutorials: "/video-tutorials",
  mediaGallery: "/media-gallery",
  contact: "/help-resources#contactUs",
  faqs: "/help-resources#faq",
  rti: "/rti",
  terms: "/policies-conditions#terms",
  privacy: "/policies-conditions#privacy",
} as const;

export type RouteName = keyof typeof PATHS;

export function href(locale: Locale, route: RouteName): string {
  return `/${locale}${PATHS[route]}`;
}

const LIVE_PORTAL = "https://oncourts.kerala.gov.in";

/** The same route on the portal being replaced, for services this one does not run yet. */
export function liveHref(route: RouteName): string {
  return `${LIVE_PORTAL}${PATHS[route]}`;
}

function normalizePath(path: string): string {
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

/**
 * The single header nav href that matches the current location. Hash targets
 * (e.g. `/en#services`) win over the locale-root "Home" link; otherwise the
 * longest matching path wins so `/about` does not light up "Home".
 */
export function activeNavHref(
  linkHrefs: readonly string[],
  pathname: string,
  hash: string
): string | null {
  const path = normalizePath(pathname);

  const hashMatch = linkHrefs.find((linkHref) => {
    const hashIndex = linkHref.indexOf("#");
    if (hashIndex === -1) return false;
    const linkPath = normalizePath(linkHref.slice(0, hashIndex));
    return linkPath === path && linkHref.slice(hashIndex) === hash;
  });
  if (hashMatch) return hashMatch;

  const pathMatches = linkHrefs.filter((linkHref) => {
    if (linkHref.includes("#")) return false;
    const linkPath = normalizePath(linkHref);
    return path === linkPath || path.startsWith(`${linkPath}/`);
  });
  if (pathMatches.length === 0) return null;

  return pathMatches.reduce((best, next) => (next.length > best.length ? next : best));
}
