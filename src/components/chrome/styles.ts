/** Visible focus, the DS ring token. Shared so chrome and the homepage match. */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** 40px hit area. Service navigation, language, footer. */
export const navLink = `inline-flex h-10 items-center rounded-lg px-3 text-body-compact font-medium ${focusRing}`;

/**
 * The one teal action on the homepage: Log in, under the cause list.
 * Nowhere else on the page uses this.
 */
export const primaryAction = `inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-body-compact font-medium text-primary-foreground ${focusRing}`;

/** A control that is not the primary: cause list, case search. */
export const secondaryAction = `inline-flex h-10 items-center justify-center rounded-lg border border-input bg-card px-4 text-body-compact font-medium ${focusRing}`;

export const textAction = `inline-flex h-10 items-center text-body font-medium underline underline-offset-4 ${focusRing}`;
