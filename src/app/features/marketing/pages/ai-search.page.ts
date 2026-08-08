import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';
import { PublicNavComponent } from '../components/public-nav/public-nav.component';
import { FeatureHeroComponent } from '../components/feature-hero/feature-hero.component';
import { ProductWindowComponent } from '../components/product-window/product-window.component';
import { FeatureSectionComponent, type FeatureBlock } from '../components/feature-section/feature-section.component';
import { CtaBandComponent } from '../components/cta-band/cta-band.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

const SOURCE_NOTES: readonly string[] = ['Series B narrative — v3', 'Acme security review', 'Enterprise pricing discussion'];

const AI_SEARCH_FEATURES: readonly FeatureBlock[] = [
  {
    icon: 'sparkles',
    title: 'Ask naturally',
    description: 'Ask questions in normal, everyday language — no special syntax to learn.',
  },
  {
    icon: 'search',
    title: 'Find the context',
    description: "Jelly Notes searches across everything you've written to find what's relevant.",
  },
  {
    icon: 'file',
    title: 'Get useful answers',
    description: 'Receive a concise answer with references back to the notes it came from.',
  },
];

@Component({
  selector: 'app-ai-search-marketing-page',
  imports: [
    PublicNavComponent,
    FeatureHeroComponent,
    ProductWindowComponent,
    FeatureSectionComponent,
    CtaBandComponent,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-search.page.html',
  styleUrl: './ai-search.page.scss',
})
export class AiSearchMarketingPage {
  protected readonly sources = SOURCE_NOTES;
  protected readonly features = AI_SEARCH_FEATURES;

  constructor() {
    inject(SeoService).update(
      'AI Search for Your Notes — Find Anything You Wrote',
      "Ask questions about everything you've written and let Jelly Notes find the context for you.",
    );
  }
}
