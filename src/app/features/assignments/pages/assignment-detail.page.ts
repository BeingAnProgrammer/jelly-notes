import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { PillComponent } from '../../../shared/ui/pill/pill.component';
import { ProgressBarComponent } from '../../../shared/ui/progress-bar/progress-bar.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { KanbanColumnComponent } from '../components/kanban-column/kanban-column.component';
import { AssignmentsService } from '../services/assignments.service';
import { groupTasksByStatus } from '../utils/group-tasks-by-status';
import { SeoService } from '../../../core/seo/seo.service';

const DUE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' });

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    RouterLink,
    IconComponent,
    PillComponent,
    ProgressBarComponent,
    EmptyStateComponent,
    KanbanColumnComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-detail.page.html',
  styleUrl: './assignment-detail.page.scss',
})
export class AssignmentDetailPage {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly seo = inject(SeoService);

  readonly id = input.required<string>();

  protected readonly assignment = computed(() =>
    this.assignmentsService.assignmentsDecorated().find((a) => a.id === this.id()),
  );

  protected readonly dueLabel = computed(() => {
    const assignment = this.assignment();
    return assignment ? DUE_FORMAT.format(new Date(assignment.due)) : '';
  });

  protected readonly columns = computed(() => groupTasksByStatus(this.assignment()?.tasks ?? []));

  constructor() {
    effect(() => {
      const assignment = this.assignment();
      this.seo.update(
        assignment?.title ?? 'Assignment',
        `Track tasks for ${assignment?.title ?? 'this assignment'}.`,
        { private: true },
      );
    });
  }

  addTask(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (!value) return;
    this.assignmentsService.addTask(this.id(), value);
    input.value = '';
  }

  advanceTask(taskId: string): void {
    this.assignmentsService.advanceTaskStatus(this.id(), taskId);
  }
}
