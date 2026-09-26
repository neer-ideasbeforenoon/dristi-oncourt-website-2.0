import { HTML_LANG, type Locale } from "@/lib/i18n/config";

const COURT_TIME_ZONE = "Asia/Kolkata";

export type CourtDate = {
  /** YYYY-MM-DD, for a `<time dateTime>` attribute. */
  iso: string;
  /** Short human date in the reader's language, e.g. "26 Sept 2026". */
  label: string;
};

function format(date: Date, locale: Locale): CourtDate {
  return {
    iso: new Intl.DateTimeFormat("en-CA", { timeZone: COURT_TIME_ZONE }).format(date),
    label: new Intl.DateTimeFormat(HTML_LANG[locale], {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: COURT_TIME_ZONE,
    }).format(date),
  };
}

/** Today in the court's time zone, whatever the server's clock is set to. */
export function courtToday(locale: Locale): CourtDate {
  return format(new Date(), locale);
}

/** A stored ISO date, formatted in the court's time zone. */
export function courtDate(iso: string, locale: Locale): CourtDate {
  return format(new Date(`${iso}T12:00:00+05:30`), locale);
}

/**
 * The footer stamp on the site being replaced. Before 17:00 in court time it shows
 * the previous calendar day, then DD/MM/YYYY.
 */
export function footerUpdatedOn(now = new Date()): CourtDate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: COURT_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  let day = value("day");
  let month = value("month");
  let year = value("year");
  if (value("hour") < 17) {
    const previous = new Date(Date.UTC(year, month - 1, day));
    previous.setUTCDate(previous.getUTCDate() - 1);
    day = previous.getUTCDate();
    month = previous.getUTCMonth() + 1;
    year = previous.getUTCFullYear();
  }

  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return { iso: `${year}-${mm}-${dd}`, label: `${dd}/${mm}/${year}` };
}
