import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { NotesService } from './notes.service';
import { NotesRepository } from '../data/notes.repository';
import { Note } from '../models/note.model';

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: overrides.id ?? 'n1',
    title: 'Test note',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: [],
    excerpt: '',
    content: [],
    updatedAt: new Date('2026-01-01').toISOString(),
    pinned: false,
    fav: false,
    archived: false,
    ...overrides,
  };
}

class FakeNotesRepository extends NotesRepository {
  notes: Note[] = [
    makeNote({ id: 'n1', fav: true }),
    makeNote({ id: 'n2', archived: true }),
    makeNote({
      id: 'n3',
      content: [
        {
          id: 'b1',
          type: 'checklist',
          items: [
            { id: 'c1', text: 'a', done: false },
            { id: 'c2', text: 'b', done: false },
          ],
        },
      ],
    }),
  ];

  getAll(): Observable<Note[]> {
    return of(this.notes);
  }

  create(note: Note): Observable<Note> {
    this.notes = [...this.notes, note];
    return of(note);
  }

  update(id: string, changes: Partial<Note>): Observable<Note> {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) return throwError(() => new Error('not found'));
    const updated = { ...this.notes[index], ...changes };
    this.notes = this.notes.map((n) => (n.id === id ? updated : n));
    return of(updated);
  }

  remove(id: string): Observable<void> {
    this.notes = this.notes.filter((n) => n.id !== id);
    return of(undefined);
  }

  seed(): void {}
}

describe('NotesService', () => {
  let service: NotesService;
  let repo: FakeNotesRepository;

  beforeEach(() => {
    repo = new FakeNotesRepository();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: NotesRepository, useValue: repo }],
    });
    service = TestBed.inject(NotesService);
  });

  it('hydrates from the repository on construction', () => {
    expect(service.notes().length).toBe(3);
  });

  it('excludes archived notes from activeNotes and includes them in archivedNotes', () => {
    expect(service.activeNotes().map((n) => n.id)).toEqual(['n1', 'n3']);
    expect(service.archivedNotes().map((n) => n.id)).toEqual(['n2']);
  });

  it('computes favoriteNotes from active, non-archived notes only', () => {
    expect(service.favoriteNotes().map((n) => n.id)).toEqual(['n1']);
  });

  it('toggleFavorite flips the fav flag and persists through the repository', () => {
    service.toggleFavorite('n1');
    expect(service.findById('n1')?.fav).toBe(false);
    expect(repo.notes.find((n) => n.id === 'n1')?.fav).toBe(false);
  });

  it('create adds a new note to the front of the signal and returns it synchronously', () => {
    const created = service.create({ title: 'New idea' });
    expect(created.title).toBe('New idea');
    expect(service.notes()[0].id).toBe(created.id);
  });

  it('archive/unarchive round-trips a note between activeNotes and archivedNotes', () => {
    service.archive('n1');
    expect(service.activeNotes().map((n) => n.id)).toEqual(['n3']);
    service.unarchive('n1');
    expect(service.activeNotes().map((n) => n.id)).toEqual(['n1', 'n3']);
  });

  it('remove deletes the note entirely', () => {
    service.remove('n1');
    expect(service.findById('n1')).toBeUndefined();
  });

  it('toggleChecklistItem flips only the targeted item', () => {
    service.toggleChecklistItem('n3', 'b1', 'c1');
    const block = service.findById('n3')?.content[0];
    expect(block?.type === 'checklist' && block.items).toEqual([
      { id: 'c1', text: 'a', done: true },
      { id: 'c2', text: 'b', done: false },
    ]);
  });

  it('addTag appends a trimmed tag and ignores duplicates and blanks', () => {
    service.addTag('n1', '  urgent  ');
    expect(service.findById('n1')?.tags).toEqual(['urgent']);

    service.addTag('n1', 'urgent');
    expect(service.findById('n1')?.tags).toEqual(['urgent']);

    service.addTag('n1', '   ');
    expect(service.findById('n1')?.tags).toEqual(['urgent']);
  });

  it('removeTag removes only the targeted tag', () => {
    service.addTag('n1', 'a');
    service.addTag('n1', 'b');
    service.removeTag('n1', 'a');
    expect(service.findById('n1')?.tags).toEqual(['b']);
  });
});
