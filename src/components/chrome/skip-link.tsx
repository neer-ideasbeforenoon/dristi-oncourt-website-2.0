import { focusRing } from "@/components/chrome/styles";

/**
 * First in the tab order. Off-screen until focused, then a real control.
 * The target is the one `<main id="main">` each page renders.
 */
export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className={`bg-primary text-primary-foreground fixed top-0 left-4 z-50 inline-flex h-10 -translate-y-full items-center rounded-lg px-4 text-body-compact font-medium focus:translate-y-4 ${focusRing}`}
    >
      {label}
    </a>
  );
}
