import { Observable } from 'rxjs';
import { AiAnswer } from '../models/ai-answer.model';
import { SearchResult } from '../models/search-result.model';
import { ChatMessage } from '../models/chat-message.model';

/**
 * Abstract class used as both the type and the DI token. `MockAiService` derives real answers
 * from live app state today (keyword matching over notes); a real LLM-backed implementation
 * swaps in later via a single `useClass` change in app.config.ts with no call-site changes.
 */
export abstract class AiService {
  abstract getDailyDigest(): Observable<string>;
  abstract askQuestion(query: string): Observable<AiAnswer>;
  abstract searchNotes(query: string): Observable<SearchResult[]>;
  abstract sendChatMessage(message: string, history: ChatMessage[]): Observable<ChatMessage>;
}
