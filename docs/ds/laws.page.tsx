import type { Metadata } from "next";
import Link from "next/link";

import { Callout } from "@/components/docs/callout";
import { DoDont } from "@/components/docs/do-dont";
import { PageHeader } from "@/components/docs/page-header";
import { DocsSection } from "@/components/docs/section";

export const metadata: Metadata = {
  title: "Laws",
};

export default function LawsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Laws"
        description="Hard constraints from the Abhiram Figma Laws page. Breaking these is a defect, not a style preference."
      />

      <Callout tone="warning" title="Also in AGENTS.md">
        Coding agents must follow these laws. Full product principles live on{" "}
        <Link href="/principles" className="underline underline-offset-3">
          Principles
        </Link>
        .
      </Callout>

      <DocsSection
        title="No alpha status fills"
        description="Status and brand tints use opaque *-muted tokens. Alpha is reserved for transient interaction layers, focus rings, shadows, and scrims."
      >
        <DoDont
          do={[
            "bg-destructive-muted text-destructive-muted-foreground",
            "bg-success-muted, bg-warning-muted, bg-info-muted, bg-brand-muted",
          ]}
          dont={[
            "bg-destructive/10, bg-success/5, bg-primary/10 for fills",
            "Inventing translucent status washes per screen",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Sentence case"
        description="UI copy uses sentence case — not Title Case for labels and buttons."
      >
        <DoDont
          do={["Save draft", "Next hearing", "Stay signed in"]}
          dont={["Save Draft", "Next Hearing", "Stay Signed In"]}
        />
      </DocsSection>

      <DocsSection
        title="Ration teal"
        description="Primary teal is highest emphasis. One strong primary action per view."
      >
        <DoDont
          do={[
            "One bg-primary button per visual region",
            "Status colors for status — never recolor brand for success",
          ]}
          dont={[
            "Multiple competing primary buttons",
            "Decorative teal icons or fills",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Control metrics"
        description="Default controls are 40px tall with radius-lg (10px). Heights stay on 32 / 36 / 40 / 44."
      >
        <DoDont
          do={[
            "h-10 on Input, Select trigger, Button default",
            "rounded-lg on controls; rounded-xl on containers",
          ]}
          dont={[
            "Arbitrary heights like h-[42px]",
            "radius-md as the default control corner",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Stay on the spacing ladder"
        description="4px grid, 8px rhythm. Allowed steps: 0.5 · 1 · 1.5 · 2 · 2.5 · 3 · 4 · 6 · 8 · 12 · 16. Micro steps (0.5 / 1.5 / 2.5) are for inside controls only. Code uses Tailwind’s default scale — no custom spacing tokens."
      >
        <DoDont
          do={[
            "p-6 card padding · gap-4 related stacks · gap-8 section breaks",
            "p-2 / p-2.5 inside controls when the chrome needs it",
          ]}
          dont={[
            "Off-ladder padding or gap: p-5, p-7, gap-5, gap-10",
            // ds-tokens-ignore — anti-example in docs prose
            "Arbitrary lengths: p-[13px], gap-[18px]",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Prefilled is amber fill only"
        description="Machine-read values use bg-prefilled. The border stays input — never signal prefilled with border color alone."
      >
        <DoDont
          do={['<Input prefilled />', "Keep border-input"]}
          dont={[
            "Amber borders for prefilled",
            "Using warning as a stand-in for prefilled",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Grouped content gets a border"
        description="Self-contained panels need a visible edge. The page is white and card shares that white on purpose — a panel reads by its hairline edge and raised shadow, not by a fill difference. Dark is flat the same way (card = page). Keep the Card edge. bg-muted / surface-raised sit on neutral-2 — not a panel edge alone. Nested soft fill inside a card: surface-sunken, with a hairline when the well holds interactive content. Muted alone without an edge is still a defect."
      >
        <DoDont
          do={[
            "Card for FAQ blocks, form sections, and sidebar widgets",
            "Description list inside Card for a single record's key-value fields",
            "surface-sunken for nested media wells inside a Card (video placeholder, document preview)",
            "surface-sunken + a hairline for control-sized wells — the tabs list, a segmented control",
          ]}
          dont={[
            "rounded-xl bg-muted as a stand-in for Card — no edge, wrong role",
            "Hand-rolled dl grids when Description list exists",
            "surface-raised or muted fill expecting it to read as a container without border",
            "Reach for bg-track on a control-sized well — track is for tiny countable marks only",
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Accessibility floor"
        description="WCAG 2.1 AA + WAI-ARIA 1.2. Visible labels, focus rings, 40×40px touch targets, timeout warnings, and script-capable layout are defects when missing — not preferences."
      >
        <DoDont
          do={[
            "Visible Label on every field; keep focus-visible rings",
            "SessionTimeout before expiry; ≥ 40×40px touch targets",
          ]}
          dont={[
            "Placeholder-only fields",
            "Critical actions only on hover; silent session expiry",
          ]}
        />
        <Callout className="mt-4">
          Full checklist:{" "}
          <Link
            href="/foundations/accessibility"
            className="underline underline-offset-3"
          >
            Accessibility
          </Link>
          .
        </Callout>
      </DocsSection>
    </div>
  );
}
