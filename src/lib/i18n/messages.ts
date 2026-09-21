import type { Locale } from "./config";

import en from "@/messages/en.json";
import ml from "@/messages/ml.json";

/**
 * Copy is imported, not fetched.
 *
 * The portal being replaced pulls every string from the eGov/DIGIT localization service
 * at runtime, which is why its pages render as a spinner: the HTML arrives, then the
 * JavaScript boots, then the words are requested over the network. Bundling the copy
 * means a court notice is in the server's first response.
 *
 * If a string genuinely has to come from DIGIT at runtime (a live cause list, say),
 * fetch it in a server component so it still lands in the HTML.
 */
const MESSAGES = { en, ml } as const;

export type Messages = typeof en;

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] as Messages;
}
