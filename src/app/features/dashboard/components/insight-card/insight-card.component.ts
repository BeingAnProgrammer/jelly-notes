import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-insight-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="card" [routerLink]="link()" [queryParams]="queryParams() ?? null">
      <div class="label">{{ label() }}</div>
      <div class="value">{{ value() }}</div>
      <div class="delta" [style.color]="deltaColor()">{{ delta() }}</div>
    </a>
  `,
  styles: `
    @use 'mixins' as *;

    .card {
      @include interactive-card;
      display: block;
      padding: var(--space-16) var(--space-16) var(--space-14);
      text-decoration: none;
    }

    .label {
      font-size: var(--text-12);
      color: var(--ink-4);
      margin-bottom: var(--space-8);
    }

    .value {
      font-family: var(--font-mono);
      font-size: var(--text-26);
      font-weight: var(--weight-input);
      color: var(--ink);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }

    .delta {
      margin-top: var(--space-8);
      font-size: var(--text-12);
    }
  `,
})
export class InsightCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly delta = input('');
  readonly deltaColor = input('var(--ink-4)');
  readonly link = input.required<string>();
  readonly queryParams = input<Record<string, string>>();
}
