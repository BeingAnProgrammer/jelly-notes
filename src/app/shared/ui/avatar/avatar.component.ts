import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarGradient } from '../../../core/auth/models/user.model';

export const AVATAR_GRADIENTS: Record<AvatarGradient, string> = {
  'gradient-1': 'linear-gradient(140deg, #9c7ff0, #6b46e0)',
  'gradient-2': 'linear-gradient(140deg, #34d8b8, #159c82)',
  'gradient-3': 'linear-gradient(140deg, #4fb8f0, #1f7dc4)',
  'gradient-4': 'linear-gradient(140deg, #ff9466, #d64a26)',
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
      /* Fixed white literal, not a theme token — tuned for contrast against every gradient
         swatch below, independent of the app's own light/dark theme. */
      color: #ffffff;
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
