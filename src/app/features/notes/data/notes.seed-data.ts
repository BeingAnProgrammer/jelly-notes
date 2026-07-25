import { Note } from '../models/note.model';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * HOUR).toISOString();
const daysAgo = (d: number) => new Date(now - d * DAY).toISOString();

export const NOTES_SEED: Note[] = [
  {
    id: 'n1',
    title: 'Series B narrative — v3',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: ['deck', 'narrative'],
    excerpt:
      'The three-act story: category creation, the wedge, and the inevitable platform. Act two needs the recall-speed metric.',
    updatedAt: hoursAgo(2),
    pinned: true,
    fav: true,
    archived: false,
    content: [
      {
        id: 'n1-b1',
        type: 'paragraph',
        runs: [
          { text: 'The story is in three acts. Right now act two is soft — we’re telling investors ' },
          { text: 'what', emphasis: true },
          { text: ' we built without making the wedge feel inevitable.' },
        ],
      },
      { id: 'n1-b2', type: 'heading', level: 2, text: 'Act one — the category' },
      {
        id: 'n1-b3',
        type: 'paragraph',
        runs: [
          { text: 'Knowledge tools optimized for capture, not recall. Everyone has a graph; nobody can ' },
          { text: 'ask it anything', bold: true },
          { text: '. That’s the opening.' },
        ],
      },
      { id: 'n1-b4', type: 'heading', level: 2, text: 'Act two — the wedge' },
      {
        id: 'n1-b5',
        type: 'blockquote',
        text: 'Memora is the first notes app where the AI has read every note you’ve ever written.',
      },
      {
        id: 'n1-b6',
        type: 'paragraph',
        runs: [{ text: 'Open threads to close before the board call:' }],
      },
      {
        id: 'n1-b7',
        type: 'checklist',
        items: [
          { id: 'n1-c1', text: 'Land on the one-line category claim', done: true },
          { id: 'n1-c2', text: 'Quantify recall speed vs. Notion search (target < 2s)', done: false },
          { id: 'n1-c3', text: 'Pull NRR & cohort chart from the growth note', done: false },
        ],
      },
      { id: 'n1-b8', type: 'heading', level: 2, text: 'The metrics that matter' },
      {
        id: 'n1-b9',
        type: 'table',
        headers: ['Metric', 'Now', 'QoQ'],
        rows: [
          ['Net revenue retention', '128%', '+6pt'],
          ['ARR', '$14.2M', '+8.1%'],
          ['Payback', '11 mo', '+1 mo'],
        ],
      },
      {
        id: 'n1-b10',
        type: 'paragraph',
        runs: [{ text: 'The narrative hook, in code so we can reuse it in the deck generator:' }],
      },
      {
        id: 'n1-b11',
        type: 'code',
        language: 'javascript',
        code: "const thesis = {\n  category: 'recall, not capture',\n  moat:     'AI over the personal graph',\n  ask:      18_000_000,\n};",
      },
      {
        id: 'n1-b12',
        type: 'paragraph',
        runs: [
          { text: 'Links here: ' },
          { text: 'Pricing v2', link: '/notes/n2' },
          { text: ', ' },
          { text: 'Q3 board deck', link: '/notes/n6' },
          { text: '.' },
        ],
      },
    ],
  },
  {
    id: 'n2',
    title: 'Pricing v2 — experiment log',
    folder: 'Growth',
    dot: 'var(--ochre)',
    tags: ['pricing', 'experiments'],
    excerpt:
      'Cohort A is converting 18% higher on the usage-based hybrid. Still deciding whether to gate AI credits separately.',
    updatedAt: daysAgo(1),
    pinned: false,
    fav: false,
    archived: false,
    content: [
      {
        id: 'n2-b1',
        type: 'paragraph',
        runs: [
          {
            text: 'Shifted from pure seat-based toward a usage-based hybrid. Cohort A is converting 18% higher than the control.',
          },
        ],
      },
      { id: 'n2-b2', type: 'heading', level: 2, text: 'Open question' },
      {
        id: 'n2-b3',
        type: 'paragraph',
        runs: [{ text: 'Whether to gate AI credits separately from seats before the next cohort ships.' }],
      },
    ],
  },
  {
    id: 'n3',
    title: 'Onboarding teardown',
    folder: 'Product',
    dot: 'var(--ink-blue)',
    tags: ['onboarding', 'ux'],
    excerpt: 'Session recordings show a 22% drop-off right after the workspace-import step.',
    updatedAt: daysAgo(3),
    pinned: false,
    fav: false,
    archived: false,
    content: [
      {
        id: 'n3-b1',
        type: 'paragraph',
        runs: [
          { text: 'Session recordings show a ' },
          { text: '22% drop-off', bold: true },
          { text: ' right after the workspace-import step — likely the empty-state confusion.' },
        ],
      },
    ],
  },
  {
    id: 'n4',
    title: '1:1 — Priya (Eng)',
    folder: 'People',
    dot: '#5b8def',
    tags: ['1:1', 'people'],
    excerpt: 'Open thread on the staff-level path — wants more scope before the title conversation.',
    updatedAt: daysAgo(6),
    pinned: false,
    fav: false,
    archived: false,
    content: [
      {
        id: 'n4-b1',
        type: 'paragraph',
        runs: [{ text: 'Staff-level path still open. She wants more scope before we talk title.' }],
      },
    ],
  },
  {
    id: 'n5',
    title: 'Architecture notes — sync engine',
    folder: 'Engineering',
    dot: 'var(--rust)',
    tags: ['architecture'],
    excerpt: 'Last-write-wins is fine for guest mode; cloud sync will need per-field merge.',
    updatedAt: daysAgo(10),
    pinned: false,
    fav: false,
    archived: false,
    content: [
      {
        id: 'n5-b1',
        type: 'paragraph',
        runs: [
          { text: 'Last-write-wins is fine for guest mode. Once cloud sync ships we’ll want per-field merge, not per-note.' },
        ],
      },
    ],
  },
  {
    id: 'n6',
    title: 'Board deck outline',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: ['deck'],
    excerpt: 'Ten slides: category, wedge, metrics, moat, team, ask.',
    updatedAt: daysAgo(15),
    pinned: true,
    fav: true,
    archived: false,
    content: [
      {
        id: 'n6-b1',
        type: 'paragraph',
        runs: [{ text: 'Ten slides: category, wedge, metrics, moat, team, ask. Keep it under fifteen minutes.' }],
      },
    ],
  },
  {
    id: 'n7',
    title: 'Q3 hiring plan',
    folder: 'People',
    dot: '#5b8def',
    tags: ['hiring'],
    excerpt: 'Closed out — two eng hires and one growth hire landed ahead of schedule.',
    updatedAt: daysAgo(40),
    pinned: false,
    fav: false,
    archived: true,
    content: [
      {
        id: 'n7-b1',
        type: 'paragraph',
        runs: [{ text: 'Closed out. Two eng hires and one growth hire landed ahead of schedule.' }],
      },
    ],
  },
];
