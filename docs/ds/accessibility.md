# Accessibility

**Scope:** Product UI built with Pucar components must meet these standards.
The docs site demonstrates patterns; product surfaces are where conformance is proven.

Read this whenever you build screens, forms, overlays, or flows with
`src/components/ui/`. Living docs: `/foundations/accessibility`.

---

## Conformance target

| Standard | Requirement |
| --- | --- |
| **WCAG 2.1 Level AA** | Floor for all citizen- and staff-facing product UI |
| **WAI-ARIA 1.2** | Correct roles, states, and properties on custom widgets; prefer native semantics and Radix primitives over reinvented ARIA |

Session timeout behaviour maps to WCAG **2.1 Success Criterion 2.2.1** (Timing Adjustable).

---

## Standards checklist (authoritative)

### 1. WCAG 2.1 Level AA
Ship against AA success criteria. Contrast, keyboard, labels, focus, timing, and resize are non-negotiable — not optional polish.

### 2. WAI-ARIA 1.2
- Prefer semantic HTML (`button`, `a`, `label`, `dl`, landmarks).
- When using Radix/shadcn, keep their ARIA wiring intact — do not strip `role`, `aria-*`, or focus traps from Dialog / Sheet / Menu / Tabs.
- Icon-only controls need an accessible name (`aria-label` or visually hidden text).

### 3. Screen reader compatibility
UI must be usable with **NVDA**, **JAWS**, and **VoiceOver**.
- Announce status changes with appropriate live regions (`aria-live`) where content updates asynchronously (e.g. session countdown, toasts).
- Do not rely on visual-only cues; pair status colour with text and/or icon (see Principles: never colour alone).

### 4. Keyboard-only navigability
Every interactive control must be reachable and operable with keyboard alone (Tab / Shift+Tab, Enter/Space, Escape to dismiss, arrow keys where Radix patterns require them).
No keyboard traps outside intentional modal focus containment.

### 5. Focus management and visible focus indicator
- Visible focus uses the **`ring`** token (teal focus ring) — never remove `focus-visible` styles for aesthetics.
- On open: move focus into Dialog / Alert Dialog / Sheet / Drawer.
- On close: restore focus to the trigger.
- Use `SessionTimeout` (or equivalent) so expiry warnings are focusable dialogs, not invisible timers.

### 6. Colour contrast ratios
- **Normal text ≥ 4.5:1** against its background (both light and dark themes).
- UI component boundaries / non-text ≥ **3:1** where required by WCAG.
- Prove with a contrast checker — do not eyeball new token pairs.

### 7. No reliance on hover for critical information
Critical actions and information must be available without hover (touch and keyboard users have no hover).
Keep primary actions visible; use menus/sheets for overflow — never hide the only path behind `:hover`.

### 8. Touch target sizing
**Minimum interactive target: 40×40px** on mobile and citizen-facing surfaces — aligned with the DS control metric (`h-10` / `size-10`).
- Prefer Button `default` or `lg` for primary mobile actions.
- Smaller visual controls (checkbox, switch, icon) must expand hit area (padding / `after:` inset) to meet **40×40px**.
- Do not pack only `xs` icon buttons as the sole actions on mobile.

### 9. Voice control compatibility
Support voice users (**Dragon NaturallySpeaking**, **iOS Voice Control**):
- Visible, spoken-friendly labels that match accessible names.
- Avoid unlabeled icon buttons and placeholder-only fields (voice users say the visible label).

### 10. 200% text zoom
Layouts must remain usable at **200% browser text zoom** without loss of content or functionality and without forcing only horizontal scrolling of the whole page.
- Prefer fluid widths (`w-full`, `max-w-*`, `min-w-0`) over fixed pixel traps.
- Allow text to wrap; avoid truncating critical labels with no alternative.

### 11. Timeout warnings before session expiry
Warn before session expiry so users can extend time or save work.
Use **`SessionTimeout`** (`@/components/ui/session-timeout`) — Alert Dialog + countdown well with `aria-live="polite"`.
Never expire silently on flows that risk data loss.

### 12. Visible labels on all interactive elements
Every field and control has a **visible label** (or equivalent permanent text).
- Use `Label` / `FieldLabel` — **never placeholder-only** fields.
- Placeholders may hint format; they are not labels.
- Icon-only buttons still need an accessible name; prefer a visible text label when space allows.

### 13. Multilingual and script support
Court deployments may require **Devanagari, Tamil**, and other Indic scripts (and English).
- UI strings are localizable — do not bake English-only assumptions into component APIs.
- Line height and wrapping must tolerate longer translated strings and taller Indic glyphs.
- When serving non-Latin scripts, extend the font stack with appropriate Unicode fonts (e.g. Noto Sans Devanagari / Tamil) **in product apps** — do not assume Helvetica covers those scripts.
- Keep `lang` (and `dir` when needed) correct on the document or region.

---

## Core subset (always enforce)

Even on the shortest product checklists, these never drop:

1. WCAG 2.1 Level AA  
2. WAI-ARIA 1.2  
3. Focus management and visible focus indicator  
4. Colour contrast ≥ 4.5:1 for normal text  
5. Touch targets ≥ **40×40px**  
6. 200% text zoom without layout breaking  
7. Multilingual / Indic script support per court  

---

## Component mapping (use these)

| Need | Use |
| --- | --- |
| Labeled fields | `Field` + `FieldLabel` + `Input` / `Textarea` — `FieldError` binds via `aria-describedby` automatically |
| Session expiry warning | `SessionTimeout` |
| Standing page notice | `Banner` (not Toast) |
| Transient confirmation | Toast / Sonner (not for errors that require action) |
| Modal focus trap | `Dialog` / `AlertDialog` / `Sheet` |
| Status without colour-alone | `Badge` + text, or icon + label |
| 40px touch primary action | `Button` default (`h-10`) or larger |

---

## Agent rules (short)

1. Target **WCAG 2.1 AA** + **WAI-ARIA 1.2**.
2. Never remove visible focus rings.
3. Never ship placeholder-only inputs.
4. Touch targets ≥ **40×40px**.
5. Warn before session timeout; use `SessionTimeout` when building auth/session UX.
6. Don’t hide critical UI behind hover.
7. Support 200% zoom and Indic script locales in layout and typography choices.
8. Verify NVDA / JAWS / VoiceOver and keyboard-only paths for critical flows.
