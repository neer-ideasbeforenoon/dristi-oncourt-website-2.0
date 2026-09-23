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
    title: t["search.title"],
    description: t["search.description"],
    alternates: { canonical: `/${locale}/search` },
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await readPage(params);
  return <PageMain title={t["search.heading"]} intro={t["search.intro"]} />;
}
