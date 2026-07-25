import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AiChatPanelComponent } from './ai-chat-panel.component';
import { AiService } from '../../../ai/services/ai.service';
import { AiChatService } from '../../../ai/services/ai-chat.service';
import { NotesRepository } from '../../../../features/notes/data/notes.repository';
import { Note } from '../../../../features/notes/models/note.model';
import { ChatMessage } from '../../../ai/models/chat-message.model';
import { AiAnswer } from '../../../ai/models/ai-answer.model';
import { SearchResult } from '../../../ai/models/search-result.model';

class FakeAiService implements AiService {
  getDailyDigest(): Observable<string> {
    return of('');
  }
  askQuestion(): Observable<AiAnswer> {
    return of({ text: '', sourceNoteIds: [] });
  }
  searchNotes(): Observable<SearchResult[]> {
    return of([]);
  }
  sendChatMessage(message: string): Observable<ChatMessage> {
    return of({ id: 'r1', role: 'ai', text: `Re: ${message}`, sourceNoteId: 'n1' });
  }
}

function makeNote(overrides: Partial<Note>): Note {
  return {
    id: overrides.id ?? 'n1',
    title: 'Pricing v2',
    folder: 'Growth',
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
  notes: Note[] = [makeNote({})];
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

describe('AiChatPanelComponent', () => {
  let router: Router;
  let chat: AiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiChatPanelComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AiService, useClass: FakeAiService },
        { provide: NotesRepository, useClass: FakeNotesRepository },
      ],
    });
    router = TestBed.inject(Router);
    chat = TestBed.inject(AiChatService);
  });

  function create() {
    const fixture = TestBed.createComponent(AiChatPanelComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('resolves a source note id to its title', () => {
    const panel = create();
    expect(panel['sourceTitle']('n1')).toBe('Pricing v2');
    expect(panel['sourceTitle']('missing')).toBe('Source note');
  });

  it('openSource navigates to the note editor', () => {
    const panel = create();
    const navigateSpy = spyOn(router, 'navigate');
    panel['openSource']('n1');
    expect(navigateSpy).toHaveBeenCalledWith(['/notes', 'n1']);
  });

  it('send() forwards the input value to the chat service and clears the field', () => {
    const panel = create();
    const input = document.createElement('input');
    input.value = 'What changed?';

    panel['send'](input);

    expect(chat.messages().at(-1)).toEqual(jasmine.objectContaining({ role: 'ai', text: 'Re: What changed?' }));
    expect(input.value).toBe('');
  });
});
