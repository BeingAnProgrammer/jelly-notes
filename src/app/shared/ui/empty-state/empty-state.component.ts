import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon.types';

@Component({
  selector: 'app-empty-state',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-icon [name]="icon()" [size]="28" [strokeWidth]="1.6" />
    <p class="title">{{ title() }}</p>
    @if (description()) {
      <p class="description">{{ description() }}</p>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-8);
      padding: var(--space-40) var(--space-20);
      color: var(--ink-4);
    }

    .title {
      margin: 0;
      font-size: var(--text-14);
      font-weight: var(--weight-medium);
      color: var(--ink-3);
    }

    .description {
      margin: 0;
      font-size: var(--text-13);
      max-width: 40ch;
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input<IconName>('file');
  readonly title = input.required<string>();
  readonly description = input('');
}
