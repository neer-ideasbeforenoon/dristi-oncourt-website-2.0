import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getMessages, type Messages } from "@/lib/i18n/messages";

export async function readPage(params: Promise<{ locale: string }>): Promise<{
  locale: Locale;
  t: Messages;
}> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return { locale, t: getMessages(locale) };
}
