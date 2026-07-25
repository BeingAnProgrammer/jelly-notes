import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../../notes/services/notes.service';
import { relativeTime } from '../../../../shared/utils/relative-time';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-recent-notes-list',
  imports: [RouterLink, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recent-notes-list.component.html',
  styleUrl: './recent-notes-list.component.scss',
})
export class RecentNotesListComponent {
  protected readonly notesService = inject(NotesService);
  protected readonly relativeTime = relativeTime;
}
