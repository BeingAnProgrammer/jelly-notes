import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NotesListPage } from './notes-list.page';
import { NotesRepository } from '../data/notes.repository';
import { Note } from '../models/note.model';

function makeNote(overrides: Partial<Note>): Note {
  return {
    id: overrides.id ?? 'n',
    title: 'Note',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: [],
    excerpt: '',
    content: [],
    updatedAt: new Date().toISOString(),
    pinned: false,
    fav: false,
    archived: false,
    ...overrides,
  };
}

class FakeNotesRepository extends NotesRepository {
  notes: Note[] = [
    makeNote({ id: 'n1', folder: 'Fundraising', pinned: true, fav: true }),
    makeNote({ id: 'n2', folder: 'Growth', fav: true }),
    makeNote({ id: 'n3', folder: 'Fundraising', archived: true }),
    makeNote({ id: 'n4', folder: 'Growth' }),
  ];
  getAll(): Observable<Note[]> {
    return of(this.notes);
  }
  create(note: Note): Observable<Note> {
    return of(note);
  }
  update(): Observable<Note> {
    throw new Error('unused');
  }
  remove(): Observable<void> {
    return of(undefined);
  }
  seed(): void {}
}

describe('NotesListPage', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [NotesListPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: NotesRepository, useClass: FakeNotesRepository },
      ],
    });
  });

  function create(filter: 'all' | 'favorites' | 'archive' | 'folder', folder = '') {
    const fixture = TestBed.createComponent(NotesListPage);
    fixture.componentRef.setInput('filter', filter);
    fixture.componentRef.setInput('folder', folder);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('"all" filter splits pinned notes from the rest and excludes archived notes', () => {
    const page = create('all');
    expect(page['pinnedNotes']().map((n: Note) => n.id)).toEqual(['n1']);
    expect(page['mainNotes']().map((n: Note) => n.id)).toEqual(['n2', 'n4']);
    expect(page['notesTitle']()).toBe('All notes');
  });

  it('"favorites" filter shows only fav notes, still splitting pinned notes out', () => {
    const page = create('favorites');
    expect(page['pinnedNotes']().map((n: Note) => n.id)).toEqual(['n1']);
    expect(page['mainNotes']().map((n: Note) => n.id)).toEqual(['n2']);
    expect(page['notesTitle']()).toBe('Favorites');
  });

  it('"archive" filter never splits out a pinned section', () => {
    const page = create('archive');
    expect(page['showPinned']()).toBe(false);
  });

  it('"archive" filter shows only archived notes', () => {
    const page = create('archive');
    expect(page['mainNotes']().map((n: Note) => n.id)).toEqual(['n3']);
    expect(page['notesTitle']()).toBe('Archive');
  });

  it('"folder" filter shows only active notes in that folder and titles the page after it', () => {
    const page = create('folder', 'Growth');
    expect(page['mainNotes']().map((n: Note) => n.id)).toEqual(['n2', 'n4']);
    expect(page['notesTitle']()).toBe('Growth');
  });

  it('setView persists the chosen view and updates gridCols', () => {
    const page = create('all');
    page.setView('list');
    expect(page['view']()).toBe('list');
    expect(page['gridCols']()).toBe('1fr');
    expect(localStorage.getItem('jelly-notes.notesView')).toBe('"list"');
  });
});
