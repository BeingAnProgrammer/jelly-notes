import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PillComponent } from '../../../../shared/ui/pill/pill.component';
import { ProgressBarComponent } from '../../../../shared/ui/progress-bar/progress-bar.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { DecoratedAssignment } from '../../models/assignment.model';

const MONTH_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short' });
const DUE_FORMAT = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

@Component({
  selector: 'app-assignment-row',
  imports: [RouterLink, PillComponent, ProgressBarComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './assignment-row.component.html',
  styleUrl: './assignment-row.component.scss',
})
export class AssignmentRowComponent {
  readonly assignment = input.required<DecoratedAssignment>();

  private readonly dueDate = computed(() => new Date(this.assignment().due));
  protected readonly day = computed(() => this.dueDate().getDate());
  protected readonly month = computed(() => MONTH_FORMAT.format(this.dueDate()).toUpperCase());
  protected readonly dueLabel = computed(() => DUE_FORMAT.format(this.dueDate()));
}
