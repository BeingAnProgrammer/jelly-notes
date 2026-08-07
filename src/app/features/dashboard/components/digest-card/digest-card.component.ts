import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { AiService } from '../../../../core/ai/services/ai.service';
import { AiChatService } from '../../../../core/ai/services/ai-chat.service';
import { AssignmentsService } from '../../../assignments/services/assignments.service';

@Component({
  selector: 'app-digest-card',
  imports: [DatePipe, RouterLink, IconComponent, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './digest-card.component.html',
  styleUrl: './digest-card.component.scss',
})
export class DigestCardComponent {
  private readonly ai = inject(AiService);
  protected readonly chat = inject(AiChatService);
  private readonly assignmentsService = inject(AssignmentsService);

  protected readonly digest = signal('');
  protected readonly generatedAt = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(new Date());

  protected readonly atRisk = computed(() => this.assignmentsService.assignmentsDecorated().find((a) => a.atRisk) ?? null);

  protected readonly daysLeft = computed(() => {
    const risk = this.atRisk();
    if (!risk) return 0;
    const ms = new Date(risk.due).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  });

  constructor() {
    this.ai.getDailyDigest().subscribe((text) => this.digest.set(text));
  }
}
