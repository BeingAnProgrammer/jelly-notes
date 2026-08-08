import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';
import { PublicNavComponent } from '../components/public-nav/public-nav.component';
import { FeatureHeroComponent } from '../components/feature-hero/feature-hero.component';
import { ProductWindowComponent } from '../components/product-window/product-window.component';
import { FeatureSectionComponent, type FeatureBlock } from '../components/feature-section/feature-section.component';
import { CtaBandComponent } from '../components/cta-band/cta-band.component';

interface NotePreview {
  readonly folder: string;
  readonly dot: string;
  readonly title: string;
  readonly snippet: string;
  readonly tags: readonly string[];
}

const NOTES_PREVIEW: readonly NotePreview[] = [
  {
    folder: 'Product',
    dot: 'var(--mint)',
    title: 'Product launch ideas',
    snippet: 'Waitlist messaging, pricing tiers, and the first-week onboarding flow.',
    tags: ['launch', 'product'],
  },
  {
    folder: 'Team',
    dot: 'var(--accent)',
    title: 'Meeting notes — Q3 planning',
    snippet: 'Roadmap priorities, hiring plan, and the OKRs we agreed on.',
    tags: ['meeting', 'planning'],
  },
  {
    folder: 'Research',
    dot: 'var(--lav)',
    title: 'Research: AI knowledge systems',
    snippet: 'How retrieval-augmented systems keep answers grounded in real sources.',
    tags: ['research', 'ai'],
  },
  {
    folder: 'Growth',
    dot: 'var(--mint)',
    title: 'Pricing experiments',
    snippet: 'Cohort A is converting 18% higher on the usage-based hybrid plan.',
    tags: ['pricing', 'experiments'],
  },
  {
    folder: 'Personal',
    dot: 'var(--accent)',
    title: 'Things to remember',
    snippet: 'Renew the domain, follow up with Sam, book the offsite venue.',
    tags: ['personal'],
  },
];

const NOTES_FEATURES: readonly FeatureBlock[] = [
  {
    icon: 'note-plus',
    title: 'Capture everything',
    description: 'Quickly save ideas, thoughts, research, meeting notes, and important information.',
  },
  {
    icon: 'folder',
    title: 'Keep it organized',
    description: 'Use folders, tags, and structured notes without making organization feel like work.',
  },
  {
    icon: 'focus',
    title: 'Never lose context',
    description: 'Jelly Notes keeps your information connected so it remains useful over time.',
  },
];

@Component({
  selector: 'app-notes-page',
  imports: [PublicNavComponent, FeatureHeroComponent, ProductWindowComponent, FeatureSectionComponent, CtaBandComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes.page.html',
  styleUrl: './notes.page.scss',
})
export class NotesPage {
  protected readonly notes = NOTES_PREVIEW;
  protected readonly features = NOTES_FEATURES;

  constructor() {
    inject(SeoService).update(
      'Notes App — Capture and Organize Your Knowledge',
      'Capture ideas, decisions, research, and everything in between — organized in Jelly Notes so you can actually find it later.',
    );
  }
}
