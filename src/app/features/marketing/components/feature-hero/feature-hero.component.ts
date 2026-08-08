import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

// Shared hero for every feature landing page (notes, tasks, ai-search) — the welcome page's
// hero stays bespoke since its copy/layout is explicitly frozen, but these three pages are
// intentionally identical in structure and only differ in copy, so one component covers them.
@Component({
  selector: 'app-feature-hero',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-hero.component.html',
  styleUrl: './feature-hero.component.scss',
})
export class FeatureHeroComponent {
  readonly eyebrow = input.required<string>();
  readonly headlineTop = input.required<string>();
  readonly headlineBottom = input<string>('');
  readonly subtext = input.required<string>();
  readonly ctaLabel = input.required<string>();
  readonly ctaLink = input('/sign-in');
  readonly footnote = input('No account needed for this preview.');
}
