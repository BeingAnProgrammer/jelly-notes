import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AssignmentsService } from '../services/assignments.service';
import { AssignmentRowComponent } from '../components/assignment-row/assignment-row.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-assignments-list-page',
  imports: [AssignmentRowComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignments-list.page.html',
  styleUrl: './assignments-list.page.scss',
})
export class AssignmentsListPage {
  protected readonly assignmentsService = inject(AssignmentsService);

  constructor() {
    inject(SeoService).update('Assignments', 'Track progress across your active assignments.');
  }
}
