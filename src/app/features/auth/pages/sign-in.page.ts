import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SeoService } from '../../../core/seo/seo.service';
import { JellyfishSceneComponent } from '../components/jellyfish-scene/jellyfish-scene.component';

// Seconds for one full orbit of the word-ring / camera-relative jellyfish spin. Shared by
// the CSS keyframes (jelly-orbit) and the JellyfishSceneComponent's own rotation so the two
// stay in lockstep.
const LOOP_SECONDS = 20;
// Radius (px) of the word ring and the perspective (camera) distance for the 3D word carousel.
const RING_RADIUS = 660;
const PERSPECTIVE = 2200;

interface PhraseSeat {
  readonly text: string;
  readonly transform: string;
  readonly delay: string;
}

function buildPhraseSeats(phrases: readonly string[]): PhraseSeat[] {
  const count = phrases.length;
  const step = 360 / count;
  return phrases.map((text, i) => {
    // Phase-locks each word's fade/rise to the moment it faces the camera on the ring.
    const delaySeconds = (-LOOP_SECONDS * ((count - i) % count)) / count - LOOP_SECONDS / 2;
    return {
      text,
      transform: `rotateY(${(i * step).toFixed(2)}deg) translateZ(${RING_RADIUS}px) rotateY(180deg)`,
      delay: `${delaySeconds.toFixed(3)}s`,
    };
  });
}

interface Bubble {
  readonly left: string;
  readonly size: string;
  readonly delay: string;
  readonly duration: string;
}

interface DriftMark {
  readonly left: string;
  readonly top: string;
  readonly size: number;
  readonly duration: string;
  readonly delay: string;
}

@Component({
  selector: 'app-sign-in-page',
  imports: [IconComponent, JellyfishSceneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loopSeconds = LOOP_SECONDS;
  protected readonly perspective = PERSPECTIVE;

  protected readonly phrases = ['CAPTURE', 'ORGANIZE', 'RECALL', 'FOCUS', 'CLARITY'] as const;
  protected readonly phraseSeats = buildPhraseSeats(this.phrases);

  protected readonly navLabels = ['NOTES', 'TASKS', 'AI SEARCH'] as const;
  protected readonly tickLabels = ['AI', 'NOTES', 'TASKS', 'SEARCH'] as const;

  protected readonly manifesto =
    'MEMORA BRINGS YOUR NOTES, TASKS, AND KNOWLEDGE INTO ONE CALM, AI-POWERED WORKSPACE.';

  protected readonly captions = [
    'EVERYTHING YOU KNOW, IN ONE CALM WORKSPACE',
    "NOTES, FOLDERS, TASKS — WITH AN AI THAT'S ACTUALLY READ THEM",
    'NO ACCOUNT NEEDED FOR THIS PREVIEW',
  ] as const;

  protected readonly bubbles: readonly Bubble[] = [
    { left: '22%', size: '0.9vh', delay: '0s', duration: '13s' },
    { left: '71%', size: '1.4vh', delay: '4s', duration: '16s' },
    { left: '58%', size: '0.7vh', delay: '8s', duration: '11s' },
    { left: '38%', size: '1.1vh', delay: '6s', duration: '15s' },
  ];

  protected readonly marks: readonly DriftMark[] = [
    { left: '12%', top: '30%', size: 6, duration: '17s', delay: '0s' },
    { left: '86%', top: '62%', size: 5, duration: '21s', delay: '-6s' },
    { left: '78%', top: '26%', size: 4, duration: '14s', delay: '-3s' },
  ];

  constructor() {
    inject(SeoService).update(
      'Welcome',
      'Memora is an AI-powered note-taking and personal knowledge management app.',
    );
  }

  signIn(): void {
    this.auth.signIn();
    this.router.navigate(['/dashboard']);
  }
}
