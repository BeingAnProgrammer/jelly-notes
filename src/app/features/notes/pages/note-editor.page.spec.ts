import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { NoteEditorPage } from './note-editor.page';
import { NotesRepository } from '../data/notes.repository';
import { Note } from '../models/note.model';
import { FoldersRepository } from '../../../core/folders/data/folders.repository';
import { Folder } from '../../../core/folders/models/folder.model';

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 'n1',
    title: 'Original title',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: [],
    excerpt: '',
    content: [
      {
        id: 'b1',
        type: 'checklist',
        items: [{ id: 'c1', text: 'Item one', done: false }],
      },
    ],
    updatedAt: new Date('2026-01-01').toISOString(),
    pinned: false,
    fav: false,
    archived: false,
    ...overrides,
  };
}

class FakeNotesRepository extends NotesRepository {
  notes: Note[] = [makeNote()];
  getAll(): Observable<Note[]> {
    return of(this.notes);
  }
  create(note: Note): Observable<Note> {
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

class FakeFoldersRepository extends FoldersRepository {
  getAll(): Observable<Folder[]> {
    return of([{ name: 'Fundraising', color: 'var(--accent)' }]);
  }
  create(folder: Folder): Observable<Folder> {
    return of(folder);
  }
  seed(): void {}
}

describe('NoteEditorPage', () => {
  let repo: FakeNotesRepository;

  beforeEach(() => {
    repo = new FakeNotesRepository();
    TestBed.configureTestingModule({
      imports: [NoteEditorPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: NotesRepository, useValue: repo },
        { provide: FoldersRepository, useClass: FakeFoldersRepository },
      ],
    });
  });

  function create(id = 'n1') {
    const fixture = TestBed.createComponent(NoteEditorPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('shows undefined note() for an id that does not exist (renders the not-found empty state)', () => {
    const page = create('missing');
    expect(page['note']()).toBeUndefined();
  });

  it('startEdit copies the live title/content into draft state without touching the note yet', () => {
    const page = create();
    page.startEdit();
    expect(page['draftTitle']()).toBe('Original title');
    expect(page['editing']()).toBe(true);
    expect(page['note']()?.title).toBe('Original title');
  });

  it('saveNote commits the draft back to the note and exits editing mode', () => {
    const page = create();
    page.startEdit();
    page['draftTitle'].set('New title');
    page.saveNote();
    expect(page['editing']()).toBe(false);
    expect(page['note']()?.title).toBe('New title');
  });

  it('toggling a checklist item while NOT editing persists immediately through the service', () => {
    const page = create();
    page.onToggleItem({ blockId: 'b1', itemId: 'c1' });
    const block = page['note']()?.content[0];
    expect(block?.type === 'checklist' && block.items[0].done).toBe(true);
  });

  it('toggling a checklist item WHILE editing only mutates the local draft, not the live note', () => {
    const page = create();
    page.startEdit();
    page.onToggleItem({ blockId: 'b1', itemId: 'c1' });

    const draftBlock = page['draftContent']()[0];
    expect(draftBlock.type === 'checklist' && draftBlock.items[0].done).toBe(true);
    // Live note is untouched until Save.
    const liveBlock = page['note']()?.content[0];
    expect(liveBlock?.type === 'checklist' && liveBlock.items[0].done).toBe(false);

    page.saveNote();
    const savedBlock = page['note']()?.content[0];
    expect(savedBlock?.type === 'checklist' && savedBlock.items[0].done).toBe(true);
  });

  it('toggleFavorite and toggleArchive act on the live note immediately', () => {
    const page = create();
    page.toggleFavorite();
    expect(page['note']()?.fav).toBe(true);

    page.toggleArchive();
    expect(page['note']()?.archived).toBe(true);
    page.toggleArchive();
    expect(page['note']()?.archived).toBe(false);
  });

  it('toggleFocusMode flips focus mode and adjusts editor width/padding', () => {
    const page = create();
    expect(page['editorWidth']()).toBe(760);
    page.toggleFocusMode();
    expect(page['editorWidth']()).toBe(720);
    expect(page['editorPad']()).toBe('64px 40px 120px');
  });
});
