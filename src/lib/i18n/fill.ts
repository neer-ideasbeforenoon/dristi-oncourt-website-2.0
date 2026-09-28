/**
 * Fill `{name}` placeholders in a catalogue string. Kept apart from `messages.ts` so a
 * client component can use it without pulling the whole catalogue into the bundle.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match
  );
}
