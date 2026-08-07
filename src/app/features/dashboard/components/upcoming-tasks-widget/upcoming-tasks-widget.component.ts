import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { AssignmentsService } from '../../../assignments/services/assignments.service';
import { UpcomingTask } from '../../../assignments/models/assignment.model';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-upcoming-tasks-widget',
  imports: [RouterLink, EmptyStateComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upcoming-tasks-widget.component.html',
  styleUrl: './upcoming-tasks-widget.component.scss',
})
export class UpcomingTasksWidgetComponent {
  protected readonly assignmentsService = inject(AssignmentsService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly dueFormat = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  protected formatDue(due: string): string {
    return this.dueFormat.format(new Date(due));
  }

  protected advance(task: UpcomingTask, event: Event): void {
    const checkbox = (event.currentTarget as HTMLElement).querySelector<HTMLElement>('.checkbox');
    if (checkbox && this.isBrowser && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      gsap.fromTo(checkbox, { scale: 0.68 }, { scale: 1, duration: 0.45, ease: 'back.out(3.2)' });
    }
    this.assignmentsService.advanceTaskStatus(task.assignmentId, task.taskId);
  }
}
