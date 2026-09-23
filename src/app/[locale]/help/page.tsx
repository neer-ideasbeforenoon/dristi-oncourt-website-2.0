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
    title: t["help.title"],
    description: t["help.description"],
    alternates: { canonical: `/${locale}/help` },
  };
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await readPage(params);
  return <PageMain locale={locale} path="/help" t={t} title={t["help.heading"]} intro={t["help.intro"]} />;
}
