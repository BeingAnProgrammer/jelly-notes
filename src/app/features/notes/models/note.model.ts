import { ContentBlock } from './content-block.model';

export interface Note {
  readonly id: string;
  title: string;
  folder: string;
  /** CSS color token (e.g. 'var(--accent)') used as the note's small color-coded indicator. */
  dot: string;
  tags: string[];
  excerpt: string;
  content: ContentBlock[];
  /** ISO-8601 timestamp. Formatted for display via the relativeTime util. */
  updatedAt: string;
  pinned: boolean;
  fav: boolean;
  archived: boolean;
}

export type NotesFilter = 'all' | 'favorites' | 'archive' | 'folder';

/** Route + query params for each non-folder filter — the single source both the top nav and the
 *  command palette navigate through, instead of each hand-typing the same `{ filter: '...' }`
 *  object independently. */
export const NOTES_FILTER_LINK: Record<'all' | 'favorites' | 'archive', { link: string; queryParams: { filter: NotesFilter } }> = {
  all: { link: '/app/notes', queryParams: { filter: 'all' } },
  favorites: { link: '/app/notes', queryParams: { filter: 'favorites' } },
  archive: { link: '/app/notes', queryParams: { filter: 'archive' } },
};
