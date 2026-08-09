export interface NoteColor {
  readonly id: string;
  readonly label: string;
  readonly dot: string;
  readonly ink: string;
}

export const NOTE_COLORS: readonly NoteColor[] = [
  { id: 'red', label: 'Red', dot: 'var(--note-red)', ink: 'var(--note-red-ink)' },
  { id: 'orange', label: 'Orange', dot: 'var(--note-orange)', ink: 'var(--note-orange-ink)' },
  { id: 'amber', label: 'Amber', dot: 'var(--note-amber)', ink: 'var(--note-amber-ink)' },
  { id: 'green', label: 'Green', dot: 'var(--note-green)', ink: 'var(--note-green-ink)' },
  { id: 'teal', label: 'Teal', dot: 'var(--note-teal)', ink: 'var(--note-teal-ink)' },
  { id: 'blue', label: 'Blue', dot: 'var(--note-blue)', ink: 'var(--note-blue-ink)' },
  { id: 'violet', label: 'Violet', dot: 'var(--note-violet)', ink: 'var(--note-violet-ink)' },
  { id: 'pink', label: 'Pink', dot: 'var(--note-pink)', ink: 'var(--note-pink-ink)' },
];

const NOTE_COLOR_INK: Record<string, string> = Object.fromEntries(NOTE_COLORS.map((c) => [c.dot, c.ink]));

/** Older notes/folders still carry a `dot` from the muted UI hue set (var(--mint) etc.), which
 *  is already text-safe on its own — only the vivid --note-X swatches need this indirection to
 *  a separate ink tone, so anything not in the map just passes through unchanged. */
export function noteColorInk(dot: string): string {
  return NOTE_COLOR_INK[dot] ?? dot;
}
