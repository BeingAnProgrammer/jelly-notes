import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommandPaletteComponent } from './command-palette.component';
import { CommandPaletteService } from '../../services/command-palette.service';
import { NotesRepository } from '../../../../features/notes/data/notes.repository';
import { Note } from '../../../../features/notes/models/note.model';

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
    makeNote({ id: 'n1', title: 'Pricing v2 experiment', updatedAt: new Date('2026-01-02').toISOString() }),
    makeNote({ id: 'n2', title: 'Onboarding teardown', updatedAt: new Date('2026-01-01').toISOString() }),
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

describe('CommandPaletteComponent', () => {
  let router: Router;
  let paletteService: CommandPaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommandPaletteComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: NotesRepository, useClass: FakeNotesRepository },
      ],
    });
    router = TestBed.inject(Router);
    paletteService = TestBed.inject(CommandPaletteService);
    paletteService.open();
  });

  function create() {
    const fixture = TestBed.createComponent(CommandPaletteComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('shows all actions and recent notes when the query is empty', () => {
    const palette = create();
    expect(palette['filteredActions']().length).toBeGreaterThan(0);
    expect(palette['noteItems']().map((n) => n.id)).toEqual(['n1', 'n2']);
    expect(palette['askAiQuery']()).toBe('');
  });

  it('filters actions and notes by the typed query, and surfaces an Ask AI item', () => {
    const palette = create();
    palette['query'].set('pricing');

    expect(palette['filteredActions']().map((a) => a.label)).not.toContain('Go to Home');
    expect(palette['noteItems']().map((n) => n.id)).toEqual(['n1']);
    expect(palette['askAiQuery']()).toBe('pricing');
    expect(palette['flatItems']().at(-1)).toEqual(jasmine.objectContaining({ kind: 'ask-ai' }));
  });

  it('activating a note item navigates to its editor and closes the palette', () => {
    const palette = create();
    const navigateSpy = spyOn(router, 'navigate');

    palette['activate']({ kind: 'note', note: { id: 'n2', label: 'Onboarding teardown', meta: 'Product' } });

    expect(navigateSpy).toHaveBeenCalledWith(['/app/notes', 'n2']);
    expect(paletteService.isOpen()).toBe(false);
  });

  it('activating the Ask AI item navigates to /search with the query param', () => {
    const palette = create();
    const navigateSpy = spyOn(router, 'navigate');

    palette['activate']({ kind: 'ask-ai', query: 'pricing' });

    expect(navigateSpy).toHaveBeenCalledWith(['/app/search'], { queryParams: { q: 'pricing' } });
  });

  it('activating an action runs it and closes the palette', () => {
    const palette = create();
    const navigateSpy = spyOn(router, 'navigate');
    const dashboardAction = palette['filteredActions']().find((a) => a.label === 'Go to Home')!;

    palette['activate']({ kind: 'action', action: dashboardAction });

    expect(navigateSpy).toHaveBeenCalledWith(['/app/dashboard']);
    expect(paletteService.isOpen()).toBe(false);
  });

  it('ArrowDown/ArrowUp wrap around the flattened item list', () => {
    const palette = create();
    palette['query'].set('pricing'); // narrows to a small, known-size list

    const count = palette['flatItems']().length;
    expect(palette['highlightedIndex']()).toBe(0);

    palette['onKeydown']({ key: 'ArrowUp', preventDefault: () => {} } as KeyboardEvent);
    expect(palette['highlightedIndex']()).toBe(count - 1);

    palette['onKeydown']({ key: 'ArrowDown', preventDefault: () => {} } as KeyboardEvent);
    expect(palette['highlightedIndex']()).toBe(0);
  });

  it('Enter activates the currently highlighted item', () => {
    const palette = create();
    palette['query'].set('pricing');
    const navigateSpy = spyOn(router, 'navigate');

    const lastIndex = palette['flatItems']().length - 1;
    palette['highlightedIndex'].set(lastIndex);
    palette['onKeydown']({ key: 'Enter', preventDefault: () => {} } as KeyboardEvent);

    expect(navigateSpy).toHaveBeenCalledWith(['/app/search'], { queryParams: { q: 'pricing' } });
  });
});
