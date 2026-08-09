import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import gsap from 'gsap';

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
      [style.background]="trackColor()"
    >
      <div #fill class="fill" [style.background]="color()"></div>
    </div>
  `,
  styles: `
    .track {
      height: 8px;
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .fill {
      height: 100%;
      width: 100%;
      border-radius: var(--radius-full);
      transform: scaleX(0);
      transform-origin: left center;
    }
  `,
})
export class ProgressBarComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly fill = viewChild.required<ElementRef<HTMLElement>>('fill');
  private mm?: ReturnType<typeof gsap.matchMedia>;

  readonly percent = input(0);
  readonly color = input('var(--accent)');
  readonly trackColor = input('var(--accent-soft)');
  readonly label = input('');

  constructor() {
    effect(() => {
      const scale = this.percent() / 100;
      const el = this.fill().nativeElement;
      if (!this.isBrowser) {
        el.style.transform = `scaleX(${scale})`;
        return;
      }
      gsap.killTweensOf(el);
      this.mm?.revert();
      this.mm = gsap.matchMedia();
      this.mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: scale, duration: 1, ease: 'power3.out' });
      });
      this.mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(el, { scaleX: scale });
      });
    });
  }
}
