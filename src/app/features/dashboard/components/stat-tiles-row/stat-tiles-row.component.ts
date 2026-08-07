import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../../notes/services/notes.service';
import { AssignmentsService } from '../../../assignments/services/assignments.service';

@Component({
  selector: 'app-stat-tiles-row',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-tiles-row.component.html',
  styleUrl: './stat-tiles-row.component.scss',
})
export class StatTilesRowComponent {
  protected readonly notesService = inject(NotesService);
  protected readonly assignmentsService = inject(AssignmentsService);
}
