import { Note } from '../../../features/notes/models/note.model';

export interface SearchResult extends Note {
  readonly matchScore: number;
}
