import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { NotesService } from '../../../notes/services/notes.service';
import { AssignmentsService } from '../../../assignments/services/assignments.service';
import { ToastService } from '../../../../core/services/toast.service';

interface Attachment {
  readonly url: string;
  readonly name: string;
}

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

interface SuggestionChip {
  readonly label: string;
  readonly color: string;
  readonly bg: string;
  readonly line: string;
}

const SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'What did I decide?',
    color: 'var(--mint)',
    bg: 'var(--mint-soft)',
    line: 'var(--mint-line)',
  },
  {
    label: "What's slipping?",
    color: 'var(--warm)',
    bg: 'var(--warm-soft)',
    line: 'var(--warm-line)',
  },
  {
    label: 'Who owes me something?',
    color: 'var(--gold)',
    bg: 'var(--gold-soft)',
    line: 'var(--gold-line)',
  },
  {
    label: 'Everything on Acme',
    color: 'var(--lav)',
    bg: 'var(--lav-soft)',
    line: 'var(--lav-line)',
  },
];

@Component({
  selector: 'app-ask-hero',
  imports: [IconComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ask-hero.component.html',
  styleUrl: './ask-hero.component.scss',
})
export class AskHeroComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  protected readonly notesService = inject(NotesService);
  protected readonly assignmentsService = inject(AssignmentsService);

  protected readonly suggestions = SUGGESTIONS;
  protected readonly query = signal('');
  protected readonly hasContent = computed(() => this.query().trim().length > 0);

  protected readonly attachment = signal<Attachment | null>(null);
  protected readonly previewOpen = signal(false);

  protected ask(question?: string): void {
    const q = (question ?? this.query()).trim();
    if (!q) return;
    this.router.navigate(['/app/search'], { queryParams: { q } });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toast.show('Only image attachments are supported.');
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      this.toast.show('Image is too large (max 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.attachment.set({ url: reader.result as string, name: file.name });
    };
    reader.readAsDataURL(file);
  }

  protected removeAttachment(): void {
    this.attachment.set(null);
    this.previewOpen.set(false);
  }

  protected openPreview(): void {
    this.previewOpen.set(true);
  }

  protected closePreview(): void {
    this.previewOpen.set(false);
  }
}
