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
    title: t["notices.title"],
    description: t["notices.description"],
    alternates: { canonical: `/${locale}/notices` },
  };
}

export default async function NoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await readPage(params);
  return <PageMain title={t["notices.heading"]} intro={t["notices.intro"]} />;
}
