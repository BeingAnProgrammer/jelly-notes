import { Observable } from 'rxjs';
import { Note } from '../models/note.model';

export abstract class NotesRepository {
  abstract getAll(): Observable<Note[]>;
  abstract create(note: Note): Observable<Note>;
  abstract update(id: string, changes: Partial<Note>): Observable<Note>;
  abstract remove(id: string): Observable<void>;
  /** One-time seed write, used only by SeedService on first boot. */
  abstract seed(notes: Note[]): void;
}
