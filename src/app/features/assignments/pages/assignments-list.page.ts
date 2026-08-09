import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { AssignmentsService } from '../services/assignments.service';
import { AssignmentRowComponent } from '../components/assignment-row/assignment-row.component';
import { NewAssignmentModalComponent } from '../components/new-assignment-modal/new-assignment-modal.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-assignments-list-page',
  imports: [
    AssignmentRowComponent,
    NewAssignmentModalComponent,
    EmptyStateComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignments-list.page.html',
  styleUrl: './assignments-list.page.scss',
})
export class AssignmentsListPage {
  protected readonly assignmentsService = inject(AssignmentsService);
  protected readonly newAssignmentModalOpen = signal(false);

  protected readonly openCount = computed(
    () =>
      this.assignmentsService.assignmentsDecorated().filter((a) => a.status !== 'Complete').length,
  );
  protected readonly atRiskCount = computed(
    () => this.assignmentsService.assignmentsDecorated().filter((a) => a.atRisk).length,
  );

  constructor() {
    inject(SeoService).update('Assignments', 'Track progress across your active assignments.');
  }
}
