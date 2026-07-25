import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <button
        type="button"
        class="glyph"
        [class]="task().status"
        [attr.aria-label]="'Advance status of ' + task().title"
        (click)="advance.emit()"
      >
        @if (task().status === 'done') {
          <app-icon name="checkmark" [size]="12" [strokeWidth]="3" />
        } @else if (task().status === 'progress') {
          <span class="inner-dot"></span>
        }
      </button>
      <span class="title" [class.done]="task().status === 'done'">{{ task().title }}</span>
    </div>
  `,
  styles: `
    @use 'mixins' as *;

    .card {
      display: flex;
      align-items: center;
      gap: var(--space-10);
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--radius-xl);
      padding: var(--space-13) var(--space-14);
      margin-bottom: var(--space-8);
      box-shadow: 0 1px 2px rgb(0 0 0 / 14%);
      transition:
        border-color var(--duration-fast) var(--ease-standard),
        transform var(--duration-fast) var(--ease-standard),
        box-shadow var(--duration-fast) var(--ease-standard);

      &:hover {
        border-color: var(--ink-5);
        transform: translateY(-1px);
        box-shadow: 0 8px 20px -8px rgb(0 0 0 / 45%);
      }
    }

    .glyph {
      width: 20px;
      height: 20px;
      border-radius: var(--radius-sm);
      border: 1.6px solid var(--ink-5);
      background: none;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      cursor: pointer;
      color: var(--accent-fg);

      &.progress {
        border-color: var(--accent);
      }

      &.done {
        background: var(--accent);
        border-color: var(--accent);
      }

      @include focus-ring;
    }

    .inner-dot {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: var(--accent);
    }

    .title {
      font-size: var(--text-14);
      color: var(--ink-2);

      &.done {
        text-decoration: line-through;
        color: var(--ink-4);
      }
    }
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();
  readonly advance = output<void>();
}
