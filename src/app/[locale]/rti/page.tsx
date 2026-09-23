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
    title: t["rti.title"],
    description: t["rti.description"],
    alternates: { canonical: `/${locale}/rti` },
  };
}

export default async function RtiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await readPage(params);
  return <PageMain locale={locale} path="/rti" t={t} title={t["rti.heading"]} intro={t["rti.intro"]} />;
}
