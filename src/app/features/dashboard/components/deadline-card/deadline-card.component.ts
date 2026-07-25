import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecoratedAssignment } from '../../../assignments/models/assignment.model';
import { PillComponent } from '../../../../shared/ui/pill/pill.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';

const DUE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

@Component({
  selector: 'app-deadline-card',
  imports: [PillComponent, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deadline-card.component.html',
  styleUrl: './deadline-card.component.scss',
})
export class DeadlineCardComponent {
  readonly assignment = input.required<DecoratedAssignment>();

  protected readonly dueLabel = computed(() => DUE_FORMAT.format(new Date(this.assignment().due)));
}
