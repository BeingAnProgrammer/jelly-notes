import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AiChatService } from './ai-chat.service';
import { AiService } from './ai.service';
import { ChatMessage } from '../models/chat-message.model';
import { AiAnswer } from '../models/ai-answer.model';
import { SearchResult } from '../models/search-result.model';

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
    return of({ id: 'reply', role: 'ai', text: `Echo: ${message}` });
  }
}

describe('AiChatService', () => {
  let service: AiChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: AiService, useClass: FakeAiService }],
    });
    service = TestBed.inject(AiChatService);
  });

  it('starts closed with a single greeting message', () => {
    expect(service.isOpen()).toBe(false);
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].role).toBe('ai');
  });

  it('openChat/closeChat/toggleChat control visibility', () => {
    service.openChat();
    expect(service.isOpen()).toBe(true);
    service.closeChat();
    expect(service.isOpen()).toBe(false);
    service.toggleChat();
    expect(service.isOpen()).toBe(true);
  });

  it('sendMessage appends the user message and the AI reply in order', () => {
    service.sendMessage('What changed in pricing?');
    const messages = service.messages();
    expect(messages.length).toBe(3);
    expect(messages[1]).toEqual(jasmine.objectContaining({ role: 'user', text: 'What changed in pricing?' }));
    expect(messages[2]).toEqual(jasmine.objectContaining({ role: 'ai', text: 'Echo: What changed in pricing?' }));
  });

  it('sendMessage ignores blank input', () => {
    service.sendMessage('   ');
    expect(service.messages().length).toBe(1);
  });

  it('Escape closes the chat only while it is open', () => {
    service.openChat();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(service.isOpen()).toBe(false);
  });
});
