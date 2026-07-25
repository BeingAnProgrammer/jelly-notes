import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AiSearchPage } from './ai-search.page';
import { AiService } from '../../../core/ai/services/ai.service';
import { AiAnswer } from '../../../core/ai/models/ai-answer.model';
import { SearchResult } from '../../../core/ai/models/search-result.model';
import { ChatMessage } from '../../../core/ai/models/chat-message.model';
import { NotesRepository } from '../../notes/data/notes.repository';
import { Note } from '../../notes/models/note.model';

class FakeAiService implements AiService {
  getDailyDigest(): Observable<string> {
    return of('');
  }
  askQuestion(query: string): Observable<AiAnswer> {
    return of({ text: `Answer for ${query}`, sourceNoteIds: ['n1'] });
  }
  searchNotes(query: string): Observable<SearchResult[]> {
    return of([{ ...makeNote({ id: 'n1', title: 'Match' }), matchScore: 80 }]);
  }
  sendChatMessage(): Observable<ChatMessage> {
    return of({ id: 'x', role: 'ai', text: '' });
  }
}

function makeNote(overrides: Partial<Note>): Note {
  return {
    id: overrides.id ?? 'n1',
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

class EmptyNotesRepository extends NotesRepository {
  notes: Note[] = [makeNote({ id: 'n1', title: 'Match' })];
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

describe('AiSearchPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiSearchPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AiService, useClass: FakeAiService },
        { provide: NotesRepository, useClass: EmptyNotesRepository },
      ],
    });
  });

  it('does not search until the user submits a query', () => {
    const fixture = TestBed.createComponent(AiSearchPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    expect(page['hasSearched']()).toBe(false);
    expect(page['answer']()).toBeNull();
  });

  it('submit() runs the search and populates the answer and results', () => {
    const fixture = TestBed.createComponent(AiSearchPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page['query'].set('pricing');
    page['submit']();

    expect(page['hasSearched']()).toBe(true);
    expect(page['answer']()?.text).toBe('Answer for pricing');
    expect(page['results']().map((r) => r.id)).toEqual(['n1']);
  });

  it('ignores a blank query on submit', () => {
    const fixture = TestBed.createComponent(AiSearchPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    page['query'].set('   ');
    page['submit']();

    expect(page['hasSearched']()).toBe(false);
  });

  it('auto-runs a search once when a "q" input is bound (e.g. from the command palette)', () => {
    const fixture = TestBed.createComponent(AiSearchPage);
    fixture.componentRef.setInput('q', 'pricing');
    fixture.detectChanges();
    const page = fixture.componentInstance;

    expect(page['query']()).toBe('pricing');
    expect(page['answer']()?.text).toBe('Answer for pricing');
  });

  it('sourceTitle resolves a note id to its title, falling back gracefully', () => {
    const fixture = TestBed.createComponent(AiSearchPage);
    fixture.detectChanges();
    const page = fixture.componentInstance;

    expect(page['sourceTitle']('n1')).toBe('Match');
    expect(page['sourceTitle']('missing')).toBe('Note');
  });
});
