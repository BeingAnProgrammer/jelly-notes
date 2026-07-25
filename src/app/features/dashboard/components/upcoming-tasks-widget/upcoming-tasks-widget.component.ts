import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AssignmentsService } from '../../../assignments/services/assignments.service';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-upcoming-tasks-widget',
  imports: [RouterLink, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upcoming-tasks-widget.component.html',
  styleUrl: './upcoming-tasks-widget.component.scss',
})
export class UpcomingTasksWidgetComponent {
  protected readonly assignmentsService = inject(AssignmentsService);

  private readonly dueFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  protected formatDue(due: string): string {
    return this.dueFormat.format(new Date(due));
  }
}
