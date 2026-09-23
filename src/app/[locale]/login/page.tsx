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
    title: t["login.title"],
    description: t["login.description"],
    alternates: { canonical: `/${locale}/login` },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await readPage(params);
  return <PageMain title={t["login.heading"]} intro={t["login.intro"]} />;
}
