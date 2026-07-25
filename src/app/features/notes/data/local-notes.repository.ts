import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { NotesRepository } from './notes.repository';
import { Note } from '../models/note.model';
import { LocalStorageService } from '../../../core/persistence/local-storage.service';

const STORAGE_KEY = 'notes';

@Injectable()
export class LocalNotesRepository implements NotesRepository {
  private readonly storage = inject(LocalStorageService);

  getAll(): Observable<Note[]> {
    return of(this.storage.get<Note[]>(STORAGE_KEY) ?? []);
  }

  create(note: Note): Observable<Note> {
    const notes = this.readAll();
    this.writeAll([...notes, note]);
    return of(note);
  }

  update(id: string, changes: Partial<Note>): Observable<Note> {
    const notes = this.readAll();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Note "${id}" does not exist.`));
    }
    const updated: Note = { ...notes[index], ...changes };
    const next = [...notes];
    next[index] = updated;
    this.writeAll(next);
    return of(updated);
  }

  remove(id: string): Observable<void> {
    this.writeAll(this.readAll().filter((n) => n.id !== id));
    return of(undefined);
  }

  seed(notes: Note[]): void {
    this.writeAll(notes);
  }

  private readAll(): Note[] {
    return this.storage.get<Note[]>(STORAGE_KEY) ?? [];
  }

  private writeAll(notes: Note[]): void {
    this.storage.set(STORAGE_KEY, notes);
  }
}
