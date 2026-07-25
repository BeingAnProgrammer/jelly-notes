import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AiService } from './ai.service';
import { AiAnswer } from '../models/ai-answer.model';
import { SearchResult } from '../models/search-result.model';
import { ChatMessage } from '../models/chat-message.model';
import { NotesService } from '../../../features/notes/services/notes.service';
import { AssignmentsService } from '../../../features/assignments/services/assignments.service';
import { generateId } from '../../../shared/utils/id';

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_MS = 3 * DAY_MS;
const MIN_TERM_LENGTH = 2;

@Injectable()
export class MockAiService implements AiService {
  private readonly notes = inject(NotesService);
  private readonly assignments = inject(AssignmentsService);

  getDailyDigest(): Observable<string> {
    const now = Date.now();

    const updatedRecently = this.notes
      .activeNotes()
      .filter((n) => now - new Date(n.updatedAt).getTime() < DAY_MS).length;

    const dueSoon = this.assignments
      .assignmentsDecorated()
      .filter((a) => a.status !== 'Complete' && new Date(a.due).getTime() - now < SOON_MS)
      .sort((a, b) => (a.due < b.due ? -1 : 1));

    const atRisk = dueSoon.find((a) => a.hot);
    const nearest = atRisk ?? dueSoon[0];

    const sentences: string[] = [];
    if (updatedRecently > 0) {
      sentences.push(
        `You've touched ${updatedRecently} note${updatedRecently === 1 ? '' : 's'} in the last day.`,
      );
    }
    if (nearest) {
      sentences.push(
        atRisk
          ? `"${nearest.title}" is at risk — only ${nearest.percentComplete}% done and due soon.`
          : `"${nearest.title}" is due soon, at ${nearest.percentComplete}% complete.`,
      );
    }
    if (sentences.length === 0) {
      sentences.push('Nothing urgent today — a good morning to get ahead on something.');
    }

    return of(sentences.join(' '));
  }

  askQuestion(query: string): Observable<AiAnswer> {
    const matches = this.rankNotes(query).slice(0, 3);
    if (matches.length === 0) {
      return of({
        text: "I couldn't find anything about that in your notes yet — try a different word or phrase.",
        sourceNoteIds: [],
      });
    }
    const text = `Based on ${matches.length} note${matches.length === 1 ? '' : 's'}: ${matches
      .map((m) => `"${m.title}" — ${m.excerpt}`)
      .join(' ')}`;
    return of({ text, sourceNoteIds: matches.map((m) => m.id) });
  }

  searchNotes(query: string): Observable<SearchResult[]> {
    return of(this.rankNotes(query));
  }

  sendChatMessage(message: string, _history: ChatMessage[]): Observable<ChatMessage> {
    const [top] = this.rankNotes(message);
    const text = top
      ? `Looking at "${top.title}": ${top.excerpt}`
      : "I don't see anything about that in your notes yet — try asking about one of your existing topics.";
    return of({ id: generateId(), role: 'ai', text, sourceNoteId: top?.id });
  }

  private rankNotes(query: string): SearchResult[] {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= MIN_TERM_LENGTH);
    if (terms.length === 0) return [];

    return this.notes
      .activeNotes()
      .map((note) => {
        const haystack = `${note.title} ${note.tags.join(' ')} ${note.excerpt}`.toLowerCase();
        const hits = terms.filter((t) => haystack.includes(t)).length;
        return { ...note, matchScore: Math.round((hits / terms.length) * 100) };
      })
      .filter((n) => n.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  }
}
