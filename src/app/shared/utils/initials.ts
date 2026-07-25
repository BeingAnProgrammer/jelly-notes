/** "Alex Rivera" -> "AR", "Cher" -> "C" — mirrors how the design derives avatar initials from a display name. */
export function initialsOf(displayName: string): string {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
