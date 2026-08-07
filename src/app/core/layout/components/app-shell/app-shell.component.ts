import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import gsap from 'gsap';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { ToastHostComponent } from '../toast-host/toast-host.component';
import { AiChatPanelComponent } from '../ai-chat-panel/ai-chat-panel.component';
import { CommandPaletteComponent } from '../command-palette/command-palette.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, TopNavComponent, ToastHostComponent, AiChatPanelComponent, CommandPaletteComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (!this.isBrowser) return;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      // Two rAFs: the outlet's new component is instantiated by the time NavigationEnd fires,
      // but its own change detection/layout may not have committed yet — the design's own
      // prototype has the same "wait a tick after the view changes" requirement.
      requestAnimationFrame(() => requestAnimationFrame(() => this.animateIn()));
    });
  }

  private animateIn(): void {
    const root = this.elementRef.nativeElement.querySelector('#main-content');
    if (!root) return;

    const query = (selector: string) => [...root.querySelectorAll(selector)] as HTMLElement[];
    const anim = query('[data-anim]');
    const cards = query('[data-card]');
    const digest = query('[data-digest]');
    const all = [...anim, ...cards, ...digest];
    if (!all.length) return;

    gsap.killTweensOf(all);

    // A backgrounded tab never ticks gsap's rAF-driven ticker, which would otherwise strand
    // these elements on their hidden "from" state — set them to their end state instead.
    if (this.document.hidden) {
      gsap.set(all, { clearProps: 'transform,opacity' });
      return;
    }

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      if (anim.length) {
        gsap.fromTo(anim, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 });
      }
      if (cards.length) {
        gsap.fromTo(
          cards,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.04, delay: 0.06 },
        );
      }
      if (digest.length) {
        gsap.fromTo(
          digest,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', stagger: 0.07, delay: 0.12 },
        );
      }
    });
  }
}
