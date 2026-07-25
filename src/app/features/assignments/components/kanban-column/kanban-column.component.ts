import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-kanban-column',
  imports: [TaskCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="column">
      <div class="header">
        <span class="dot" [style.background]="color()"></span>
        <span class="title">{{ title() }}</span>
        <span class="count">{{ tasks().length }}</span>
      </div>

      @if (tasks().length) {
        @for (task of tasks(); track task.id) {
          <app-task-card [task]="task" (advance)="advance.emit(task.id)" />
        }
      } @else {
        <div class="empty">Nothing here yet</div>
      }
    </div>
  `,
  styles: `
    .column {
      background: var(--canvas-sub);
      border: 1px solid var(--hairline);
      border-radius: var(--radius-2xl);
      padding: var(--space-6) var(--space-6) var(--space-14);
      min-height: 180px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: var(--space-8);
      padding: var(--space-8) var(--space-8) var(--space-10);
    }

    .dot {
      width: 9px;
      height: 9px;
      border-radius: var(--radius-full);
      flex: 0 0 auto;
    }

    .title {
      font-size: var(--text-13);
      font-weight: var(--weight-semibold);
      color: var(--ink);
    }

    .count {
      margin-left: auto;
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--radius-full);
      padding: 1px var(--space-8);
      font-family: var(--font-mono);
      font-size: var(--text-11-5);
      color: var(--ink-4);
    }

    .empty {
      margin: 0 var(--space-8);
      padding: var(--space-16);
      border: 1px dashed var(--hairline);
      border-radius: var(--radius-lg);
      text-align: center;
      font-size: var(--text-12);
      color: var(--ink-4);
    }
  `,
})
export class KanbanColumnComponent {
  readonly title = input.required<string>();
  readonly color = input.required<string>();
  readonly tasks = input.required<Task[]>();
  readonly advance = output<string>();
}
