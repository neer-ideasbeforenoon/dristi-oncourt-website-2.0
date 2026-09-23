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
    title: t["copies.title"],
    description: t["copies.description"],
    alternates: { canonical: `/${locale}/certified-copies` },
  };
}

export default async function CertifiedCopiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await readPage(params);
  return <PageMain locale={locale} path="/certified-copies" t={t} title={t["copies.heading"]} intro={t["copies.intro"]} />;
}
