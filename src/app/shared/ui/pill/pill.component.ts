import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-pill',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      font-size: var(--text-11);
      padding: var(--space-2) var(--space-8);
      border-radius: var(--radius-full);
      white-space: nowrap;
    }
  `,
  host: {
    '[style.background]': 'bg()',
    '[style.color]': 'color()',
    '[style.border]': 'bordered() ? "1px solid var(--hairline)" : "none"',
    '[style.font-weight]': 'weight()',
  },
})
export class PillComponent {
  readonly bg = input('var(--canvas-sub)');
  readonly color = input('var(--ink-3)');
  readonly bordered = input(true);
  readonly weight = input('400');
}
