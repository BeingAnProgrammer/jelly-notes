import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="track"
      role="progressbar"
      [attr.aria-valuenow]="percent()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="100"
      [attr.aria-label]="label() || null"
    >
      <div class="fill" [style.width.%]="percent()" [style.background]="color()"></div>
    </div>
  `,
  styles: `
    .track {
      height: var(--space-5);
      border-radius: var(--radius-full);
      background: var(--canvas-sub);
      overflow: hidden;
    }

    .fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width var(--duration-slow) var(--ease-standard);
    }
  `,
})
export class ProgressBarComponent {
  readonly percent = input(0);
  readonly color = input('var(--accent)');
  readonly label = input('');
}
