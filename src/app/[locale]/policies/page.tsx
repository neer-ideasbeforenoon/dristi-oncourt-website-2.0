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
    title: t["policies.title"],
    description: t["policies.description"],
    alternates: { canonical: `/${locale}/policies` },
  };
}

export default async function PoliciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await readPage(params);
  return <PageMain title={t["policies.heading"]} intro={t["policies.intro"]} />;
}
