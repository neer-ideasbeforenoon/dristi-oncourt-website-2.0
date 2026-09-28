import type { NextRequest } from "next/server";

import { csvFilename, isActivityPeriod, isCsvView, snapshotCsv } from "@/lib/dashboard-csv";
import { DASHBOARD_SNAPSHOT } from "@/lib/dashboard-snapshot";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/**
 * The dashboard's CSV downloads, built on the server so a plain link is enough and the
 * browser needs no script to produce a file. `?view=` picks a panel's view, `&period=`
 * the activity chart's year.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const view = request.nextUrl.searchParams.get("view") ?? "all";
  const period = request.nextUrl.searchParams.get("period") ?? "all";
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  if (!isCsvView(view) || !isActivityPeriod(DASHBOARD_SNAPSHOT, period)) {
    return new Response(null, { status: 400 });
  }

  const body = snapshotCsv(DASHBOARD_SNAPSHOT, getMessages(locale), view, period);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename(DASHBOARD_SNAPSHOT, view, period)}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
