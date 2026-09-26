import type { Locale } from "@/lib/i18n/config";

/**
 * Every internal link target, in one place. Paths follow the routes of the portal being
 * replaced (see docs/current-site-audit.md). Most of these pages are not built yet, so
 * the links resolve to the locale 404 until they are.
 */
const PATHS = {
  home: "",
  services: "#services",
  about: "/about",
  dashboard: "/dashboard",
  support: "/support",
  login: "/login",
  causeList: "/live-causelist",
  caseSearch: "/search",
  certifiedCopies: "/certified-true-copies",
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
