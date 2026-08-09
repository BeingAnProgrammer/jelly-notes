import { relativeTime } from './relative-time';

describe('relativeTime', () => {
  const now = new Date('2026-07-25T12:00:00.000Z');

  it('renders "just now" for anything under a minute old', () => {
    expect(relativeTime(new Date(now.getTime() - 30_000).toISOString(), now)).toBe('just now');
  });

  it('renders minutes for under an hour', () => {
    expect(relativeTime(new Date(now.getTime() - 5 * 60_000).toISOString(), now)).toBe('5m ago');
  });

  it('renders hours for under a day', () => {
    expect(relativeTime(new Date(now.getTime() - 3 * 60 * 60_000).toISOString(), now)).toBe(
      '3h ago',
    );
  });

  it('renders "Yesterday" for the previous calendar day', () => {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(relativeTime(yesterday.toISOString(), now)).toBe('Yesterday');
  });

  it('renders a weekday name for 2-6 days ago', () => {
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const expected = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(threeDaysAgo);
    expect(relativeTime(threeDaysAgo.toISOString(), now)).toBe(expected);
  });

  it('renders "Last week" for 7-13 days ago', () => {
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    expect(relativeTime(tenDaysAgo.toISOString(), now)).toBe('Last week');
  });

  it('renders a month/day for anything older', () => {
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 40);
    const expected = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
      monthAgo,
    );
    expect(relativeTime(monthAgo.toISOString(), now)).toBe(expected);
  });
});
