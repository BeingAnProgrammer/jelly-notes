import { Note } from '../models/note.model';

/**
 * First-run content, not a demo dataset — SeedService writes this exactly once per browser
 * (gated by a persisted flag, not "collection is empty"), so this note behaves like any other
 * note from that point on: it can be edited, pinned, favorited, archived, or deleted, and none
 * of that ever recreates it.
 */
export const NOTES_SEED: Note[] = [
  {
    id: 'n1',
    title: 'Welcome to Jelly Notes',
    folder: 'General',
    dot: 'var(--note-blue)',
    tags: ['welcome'],
    excerpt: 'Your first note — how projects, pins, favorites, and AI search fit together.',
    updatedAt: new Date().toISOString(),
    pinned: false,
    fav: false,
    archived: false,
    content: [
      {
        id: 'n1-b1',
        type: 'paragraph',
        runs: [{ text: 'Welcome to Jelly Notes. This is your first note.' }],
      },
      {
        id: 'n1-b2',
        type: 'paragraph',
        runs: [
          {
            text: 'You can write down ideas, organize information, pin important notes, save favorites, and later use AI Search to find answers across everything you’ve written.',
          },
        ],
      },
      {
        id: 'n1-b3',
        type: 'blockquote',
        text: 'Think of each project as a jellyfish — the project is the body, and the notes connected to it are the tentacles.',
      },
      {
        id: 'n1-b4',
        type: 'paragraph',
        runs: [
          {
            text: 'This sample note can be edited, pinned, favorited, or deleted just like any other note.',
          },
        ],
      },
    ],
  },
];
