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
