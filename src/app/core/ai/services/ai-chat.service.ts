import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { AiService } from './ai.service';
import { ChatMessage } from '../models/chat-message.model';
import { generateId } from '../../../shared/utils/id';

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  text: "Hi! I've read your notes — ask me anything about them.",
};

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly ai = inject(AiService);

  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  private readonly _messages = signal<ChatMessage[]>([GREETING]);
  readonly messages = this._messages.asReadonly();

  private readonly _sending = signal(false);
  readonly sending = this._sending.asReadonly();

  constructor() {
    const document = inject(DOCUMENT);
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this._isOpen()) this.closeChat();
      });
    }
  }

  openChat(): void {
    this._isOpen.set(true);
  }

  closeChat(): void {
    this._isOpen.set(false);
  }

  toggleChat(): void {
    this._isOpen.update((v) => !v);
  }

  sendMessage(text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { id: generateId(), role: 'user', text: trimmed };
    this._messages.update((messages) => [...messages, userMessage]);
    this._sending.set(true);

    this.ai.sendChatMessage(trimmed, this._messages()).subscribe((reply) => {
      this._messages.update((messages) => [...messages, reply]);
      this._sending.set(false);
    });
  }
}
