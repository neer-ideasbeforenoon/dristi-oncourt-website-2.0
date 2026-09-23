/**
 * What the shared layout reads from a state.
 *
 * The chrome, the homepage order, and the destinations do not change between
 * Kerala, Punjab, and Gujarat. This object is the part that does. See docs/ia.md.
 *
 * Kerala is the only pack. `loginUrl` and `helpline` stay null until the real
 * values exist: the layout hides a helpline it does not have, and keeps Log in
 * on `/login` until the court application has an address.
 */
export type StateSite = {
  id: "kerala";
  /** Advocate sign-in on the court application. Null until the state publishes it. */
  loginUrl: string | null;
  /** Digits, spaces, and a leading +. Null until the state publishes it. */
  helpline: string | null;
};

export const site: StateSite = {
  id: "kerala",
  loginUrl: null,
  helpline: null,
};

export function loginHref(locale: string): { href: string; external: boolean } {
  if (site.loginUrl) return { href: site.loginUrl, external: true };
  return { href: `/${locale}/login`, external: false };
}

/** `tel:` href, or null when this state has no helpline yet. */
export function helplineHref(number: string | null): string | null {
  if (!number) return null;
  const digits = number.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}
