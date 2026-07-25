import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarGradient } from '../../../core/auth/models/user.model';

export const AVATAR_GRADIENTS: Record<AvatarGradient, string> = {
  'gradient-1': 'linear-gradient(140deg, #c79a5b, #9c4a2e)',
  'gradient-2': 'linear-gradient(140deg, #7ab387, #3e6b4a)',
  'gradient-3': 'linear-gradient(140deg, #7b9fcf, #2e4a6b)',
  'gradient-4': 'linear-gradient(140deg, #c56a4e, #7a2e1e)',
};

@Component({
  selector: 'app-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ initials() }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      /* Fixed dark literal, not a theme token — tuned for contrast against every warm gradient
         swatch below, independent of the app's own light/dark theme. */
      color: #0f0e0b;
      font-weight: var(--weight-bold);
      flex: 0 0 auto;
    }
  `,
  host: {
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.background]': 'gradientCss()',
    '[style.font-size.px]': 'size() * 0.43',
  },
})
export class AvatarComponent {
  readonly initials = input.required<string>();
  readonly gradient = input<AvatarGradient>('gradient-1');
  readonly size = input(30);

  protected readonly gradientCss = computed(() => AVATAR_GRADIENTS[this.gradient()]);
}
