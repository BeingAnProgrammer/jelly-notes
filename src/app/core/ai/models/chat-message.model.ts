export interface ChatMessage {
  readonly id: string;
  readonly role: 'user' | 'ai';
  readonly text: string;
  readonly sourceNoteId?: string;
}
