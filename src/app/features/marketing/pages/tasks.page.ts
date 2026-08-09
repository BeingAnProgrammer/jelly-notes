import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';
import { PublicNavComponent } from '../components/public-nav/public-nav.component';
import { FeatureHeroComponent } from '../components/feature-hero/feature-hero.component';
import { ProductWindowComponent } from '../components/product-window/product-window.component';
import {
  FeatureSectionComponent,
  type FeatureBlock,
} from '../components/feature-section/feature-section.component';
import { CtaBandComponent } from '../components/cta-band/cta-band.component';
import { PillComponent } from '../../../shared/ui/pill/pill.component';
import { ProgressBarComponent } from '../../../shared/ui/progress-bar/progress-bar.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

type TaskStatus = 'todo' | 'in-progress' | 'completed';

interface TaskPreview {
  readonly title: string;
  readonly status: TaskStatus;
  readonly statusLabel: string;
  readonly pillBg: string;
  readonly pillColor: string;
  readonly percent: number | null;
  readonly source: string;
}

const TASKS_PREVIEW: readonly TaskPreview[] = [
  {
    title: 'Review product requirements',
    status: 'completed',
    statusLabel: 'Completed',
    pillBg: 'var(--mint-soft)',
    pillColor: 'var(--mint)',
    percent: null,
    source: 'Product launch ideas',
  },
  {
    title: 'Send proposal to client',
    status: 'in-progress',
    statusLabel: 'In progress',
    pillBg: 'var(--accent-soft)',
    pillColor: 'var(--accent)',
    percent: 60,
    source: 'Meeting notes — Q3 planning',
  },
  {
    title: 'Finish Q3 presentation',
    status: 'in-progress',
    statusLabel: 'In progress',
    pillBg: 'var(--accent-soft)',
    pillColor: 'var(--accent)',
    percent: 30,
    source: 'Meeting notes — Q3 planning',
  },
  {
    title: 'Follow up with design team',
    status: 'todo',
    statusLabel: 'To do',
    pillBg: 'var(--canvas-sub)',
    pillColor: 'var(--ink-3)',
    percent: null,
    source: 'Pricing experiments',
  },
];

const TASKS_FEATURES: readonly FeatureBlock[] = [
  {
    icon: 'note-plus',
    title: 'Create tasks from notes',
    description: 'Turn any note into a task without losing the context that created it.',
  },
  {
    icon: 'cap',
    title: 'Keep assignments connected to context',
    description: 'Every task stays linked back to the note, meeting, or decision it came from.',
  },
  {
    icon: 'bell',
    title: 'Track what needs attention',
    description: "See what's due, what's in progress, and what's waiting on you.",
  },
  {
    icon: 'checkmark',
    title: "See what's completed",
    description: "Keep a clear record of what's already done.",
  },
];

@Component({
  selector: 'app-tasks-page',
  imports: [
    PublicNavComponent,
    FeatureHeroComponent,
    ProductWindowComponent,
    FeatureSectionComponent,
    CtaBandComponent,
    PillComponent,
    ProgressBarComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
})
export class TasksPage {
  protected readonly tasks = TASKS_PREVIEW;
  protected readonly features = TASKS_FEATURES;

  constructor() {
    inject(SeoService).update(
      'Task Management — Turn Notes Into Action',
      'Keep commitments, assignments, and follow-ups close to the information that created them with Jelly Notes.',
    );
  }
}
