import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { NotesService } from '../../../notes/services/notes.service';
import { AssignmentsService } from '../../../assignments/services/assignments.service';

interface SuggestionChip {
  readonly label: string;
  readonly color: string;
  readonly bg: string;
  readonly line: string;
}

const SUGGESTIONS: SuggestionChip[] = [
  { label: 'What did I decide?', color: 'var(--mint)', bg: 'var(--mint-soft)', line: 'var(--mint-line)' },
  { label: "What's slipping?", color: 'var(--warm)', bg: 'var(--warm-soft)', line: 'var(--warm-line)' },
  { label: 'Who owes me something?', color: 'var(--gold)', bg: 'var(--gold-soft)', line: 'var(--gold-line)' },
  { label: 'Everything on Acme', color: 'var(--lav)', bg: 'var(--lav-soft)', line: 'var(--lav-line)' },
];

@Component({
  selector: 'app-ask-hero',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ask-hero.component.html',
  styleUrl: './ask-hero.component.scss',
})
export class AskHeroComponent {
  private readonly router = inject(Router);
  protected readonly notesService = inject(NotesService);
  protected readonly assignmentsService = inject(AssignmentsService);

  protected readonly suggestions = SUGGESTIONS;
  protected readonly query = signal('');

  protected ask(question?: string): void {
    const q = (question ?? this.query()).trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}
