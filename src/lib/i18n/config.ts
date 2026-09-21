/**
 * Locales this portal serves.
 *
 * Malayalam is not an enhancement here. This is the public court portal for Kerala, and
 * GIGW 3.0 treats multilingual delivery as a requirement rather than a nicety. `en`
 * leads only because it is what exists today on oncourts.kerala.gov.in; that is a
 * migration fact, not a statement about which language matters.
 *
 * The locale lives in the URL (`/en/...`, `/ml/...`) rather than in a cookie so that a
 * link someone shares, or a search engine indexes, carries its language with it.
 */
export const LOCALES = ["en", "ml"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Written into `<html lang>` — server-side, in the layout. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en-IN",
  ml: "ml-IN",
};

/** Shown in the language switcher, each in its own script. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  ml: "മലയാളം",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
