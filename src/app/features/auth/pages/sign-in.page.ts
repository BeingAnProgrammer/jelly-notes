import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { PillComponent } from '../../../shared/ui/pill/pill.component';
import { ProgressBarComponent } from '../../../shared/ui/progress-bar/progress-bar.component';
import { SeoService } from '../../../core/seo/seo.service';
import { PublicNavComponent } from '../../marketing/components/public-nav/public-nav.component';

type ShowcaseFaceId = 'notes' | 'search' | 'assignments';

interface ShowcaseFace {
  readonly id: ShowcaseFaceId;
  readonly label: string;
}

const SHOWCASE_FACES: readonly ShowcaseFace[] = [
  { id: 'notes', label: 'Notes' },
  { id: 'search', label: 'AI Search' },
  { id: 'assignments', label: 'Assignments' },
];

// How long each face of the product preview holds before crossfading to the next.
const ROTATE_MS = 4200;

@Component({
  selector: 'app-sign-in-page',
  imports: [IconComponent, PillComponent, ProgressBarComponent, PublicNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage implements OnDestroy {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private rotateHandle?: ReturnType<typeof setInterval>;

  protected readonly showcaseFaces = SHOWCASE_FACES;
  protected readonly activeFace = signal(0);

  constructor() {
    inject(SeoService).update(
      'Welcome',
      'Jelly Notes is an AI-powered note-taking and personal knowledge management app.',
    );

    // A plain setInterval isn't a CSS animation, so the app-wide reduced-motion stylesheet
    // rule can't stop it — skip starting it at all for visitors who've opted out of motion.
    if (this.isBrowser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.startRotation();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.rotateHandle);
  }

  setFace(index: number): void {
    this.activeFace.set(index);
    // Otherwise a manual pick can get overwritten by a tick that was already mid-flight,
    // which reads as "I clicked and it just changed back" — restart the hold instead.
    if (this.rotateHandle) this.startRotation();
  }

  private startRotation(): void {
    clearInterval(this.rotateHandle);
    this.rotateHandle = setInterval(() => {
      this.activeFace.update((i) => (i + 1) % SHOWCASE_FACES.length);
    }, ROTATE_MS);
  }

  getStarted(): void {
    this.router.navigate(['/sign-in']);
  }
}
