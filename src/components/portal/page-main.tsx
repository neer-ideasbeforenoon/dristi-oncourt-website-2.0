export function PageMain({ title, intro }: { title: string; intro: string }) {
  return (
    <main id="main" className="mx-auto w-full max-w-[var(--portal-content-max)] px-4 py-12">
      <h1 className="text-title-l font-semibold">{title}</h1>
      <p className="text-body text-muted-foreground mt-4 max-w-[var(--portal-measure)]">{intro}</p>
    </main>
  );
}
