const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Formats an ISO timestamp the way the design's note/task lists do: "2h ago" while recent,
 * "Yesterday"/weekday name while within the last week, then a plain month/day.
 */
export function relativeTime(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate);
  const diff = now.getTime() - then.getTime();

  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const dayDiff = Math.round((startOfToday.getTime() - startOfThen.getTime()) / DAY);

  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff > 1 && dayDiff < 7) {
    return new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(then);
  }
  if (dayDiff >= 7 && dayDiff < 14) return 'Last week';

  const formatOptions: Intl.DateTimeFormatOptions =
    then.getFullYear() === now.getFullYear()
      ? { month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat(undefined, formatOptions).format(then);
}
