import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { AiService } from '../../../../core/ai/services/ai.service';
import { AiChatService } from '../../../../core/ai/services/ai-chat.service';

@Component({
  selector: 'app-digest-card',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './digest-card.component.html',
  styleUrl: './digest-card.component.scss',
})
export class DigestCardComponent {
  private readonly ai = inject(AiService);
  protected readonly chat = inject(AiChatService);

  protected readonly digest = signal('');
  protected readonly generatedAt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date());

  constructor() {
    this.ai.getDailyDigest().subscribe((text) => this.digest.set(text));
  }
}
