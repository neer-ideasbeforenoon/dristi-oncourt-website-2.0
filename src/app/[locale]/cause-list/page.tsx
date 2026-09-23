import type { Metadata } from "next";

import { PageMain } from "@/components/portal/page-main";
import { readPage } from "@/lib/page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale, t } = await readPage(params);
  return {
    title: t["causeList.title"],
    description: t["causeList.description"],
    alternates: { canonical: `/${locale}/cause-list` },
  };
}

export default async function CauseListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await readPage(params);
  return <PageMain locale={locale} path="/cause-list" t={t} title={t["causeList.heading"]} intro={t["causeList.intro"]} />;
}
