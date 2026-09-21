import type { Metadata } from "next";
import Link from "next/link";

import { Callout } from "@/components/docs/callout";
import { DoDont } from "@/components/docs/do-dont";
import { PageHeader } from "@/components/docs/page-header";
import { DocsSection } from "@/components/docs/section";

export const metadata: Metadata = {
  title: "Principles",
};

export default function PrinciplesPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Principles"
        description="Non-negotiable rules that keep Pucar UI consistent across products, teams, and generated code."
      />

      <DocsSection
        title="1. Tokens over inventing"
        description="Never hardcode a color, spacing, or radius value. Colors and radius map to tokens; spacing uses Tailwind’s default ladder (no custom spacing tokens)."
      >
        <DoDont
          do={[
            "Use bg-primary, text-muted-foreground, border-border, rounded-md, gap-4.",
            "Add semantic meaning via tokens (success, warning, destructive).",
          ]}
          dont={[
            "Hardcode hex or oklch values in components.",
            // ds-tokens-ignore — this is the anti-example being documented
            "Use arbitrary Tailwind values like bg-[#007e7e] or rounded-[7px].",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="2. Reuse before create"
        description="Check src/components/ui/ first. Install new shadcn components upstream — do not hand-write them."
      >
        <Callout>
          Hand-written primitives drift from upstream, break updates, and
          fragment the system. Prefer{" "}
          <code>npx shadcn@latest add &lt;component&gt;</code>.
        </Callout>
      </DocsSection>

      <DocsSection
        title="3. Light and dark are equal"
        description="Every color token must exist in both :root and .dark. Theme switching is a first-class product requirement."
      >
        <DoDont
          do={[
            "Define pairs for any new semantic color.",
            "Verify contrast in both themes with the docs toggle.",
          ]}
          dont={[
            "Ship light-only tokens.",
            "Rely on OS preference alone without a class-based .dark strategy.",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="4. Teal is the brand — and it's rationed"
        description="Primary actions use teal. One strong teal action per view — if two things shout, neither is heard. Status colors (success, warning, info, destructive) stay semantic and distinct from brand."
      >
        <Callout title="Legacy naming" tone="warning">
          The Figma file sometimes labeled brand tokens as &quot;green.&quot;
          Live values are teal — this documentation is authoritative.
        </Callout>
      </DocsSection>

      <DocsSection
        title="5. The grey ladder"
        description="Each neutral step has one job. Never pick a raw neutral-N directly — go through a semantic token."
      >
        <DoDont
          do={[
            "muted (2) → surface-sunken (2½, wells) → accent (3, hover) → accent-strong (4, engaged) → secondary (5) → track (6, tiny marks) → border (8) → input (9).",
            "Let interaction move one step down — a control never hovers to its own rest color.",
          ]}
          dont={[
            "Reach for neutral-3 or any raw step in a component.",
            "Invent a new grey outside the ladder for a one-off hover state.",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="6. Never color alone"
        description="Pair every status color with an icon, label, or arrow (↑/↓ on deltas). A grayscale display or a color-blind reader must still get the meaning."
      >
        <Callout>
          A red dot with no label communicates nothing on a grayscale
          display. A red dot next to the word &quot;Overdue&quot; does.
        </Callout>
      </DocsSection>

      <DocsSection
        title="7. WCAG 2.1 AA is the floor"
        description="Conformance target is WCAG 2.1 Level AA plus WAI-ARIA 1.2. Text ≥ 4.5:1, UI boundaries ≥ 3:1, in both themes — proven by contrast checks, never eyeballed. Focus is always visible."
      >
        <DoDont
          do={[
            "Keep the teal focus ring on every interactive element.",
            "Check new token pairs against both light and dark before shipping.",
            "Follow the full checklist on Accessibility (keyboard, labels, zoom, timeouts, scripts).",
          ]}
          dont={[
            "Ship a status fill under 4.5:1 because it \"looks fine\" in one theme.",
            "Remove a focus ring for aesthetics.",
            "Use placeholder-only fields or hide critical actions behind hover.",
          ]}
        />
        <Callout className="mt-4">
          Full standards:{" "}
          <Link
            href="/foundations/accessibility"
            className="underline underline-offset-3"
          >
            Accessibility
          </Link>{" "}
          and <code>ACCESSIBILITY.md</code>.
        </Callout>
      </DocsSection>

      <DocsSection
        title="8. Control metrics aren't negotiable"
        description="Fields and buttons default to 40px (ladder 32 / 36 / 40 / 44). Container padding is 24px (16px for a small card). Chip height is 24px. Touch targets are ≥ 40×40px on any citizen-facing surface."
      >
        <Callout>
          Off-ladder sizing (a 38px button, a 20px chip) is banned the same
          way an arbitrary hex value is — it isn&apos;t a style choice.
        </Callout>
      </DocsSection>

      <DocsSection
        title="9. Accessibility is product behaviour"
        description="Screen readers (NVDA, JAWS, VoiceOver), keyboard-only use, voice control, 200% text zoom, session timeout warnings, and Indic script support are part of the system — not a separate audit after ship."
      >
        <DoDont
          do={[
            "Visible Label on every field; SessionTimeout before expiry.",
            "Fluid layouts that survive 200% zoom; font stacks that cover court scripts.",
          ]}
          dont={[
            "Expire sessions silently on draft flows.",
            "Assume Helvetica covers Devanagari or Tamil.",
          ]}
        />
      </DocsSection>
    </div>
  );
}
