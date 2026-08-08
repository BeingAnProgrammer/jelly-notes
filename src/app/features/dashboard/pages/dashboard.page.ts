import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../../core/seo/seo.service';
import { AskHeroComponent } from '../components/ask-hero/ask-hero.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [AskHeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  constructor() {
    inject(SeoService).update('Home', 'Your notes, tasks, and assignments at a glance.');
  }
}
