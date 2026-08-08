import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { AiChatService } from '../../../ai/services/ai-chat.service';
import { NotesService } from '../../../../features/notes/services/notes.service';

@Component({
  selector: 'app-ai-chat-panel',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-chat-panel.component.html',
  styleUrl: './ai-chat-panel.component.scss',
})
export class AiChatPanelComponent {
  protected readonly chat = inject(AiChatService);
  private readonly notes = inject(NotesService);
  private readonly router = inject(Router);

  protected sourceTitle(noteId: string): string {
    return this.notes.findById(noteId)?.title ?? 'Source note';
  }

  protected openSource(noteId: string): void {
    this.router.navigate(['/app/notes', noteId]);
  }

  protected send(input: HTMLInputElement): void {
    this.chat.sendMessage(input.value);
    input.value = '';
  }
}
