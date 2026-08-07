import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AssignmentsService } from '../../assignments/services/assignments.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SeoService } from '../../../core/seo/seo.service';
import { AskHeroComponent } from '../components/ask-hero/ask-hero.component';
import { DigestCardComponent } from '../components/digest-card/digest-card.component';
import { StatTilesRowComponent } from '../components/stat-tiles-row/stat-tiles-row.component';
import { RecentNotesListComponent } from '../components/recent-notes-list/recent-notes-list.component';
import { UpcomingTasksWidgetComponent } from '../components/upcoming-tasks-widget/upcoming-tasks-widget.component';

const EYEBROW_FORMAT = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'long', day: 'numeric' });
const SOON_MS = 2 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-dashboard-page',
  imports: [AskHeroComponent, DigestCardComponent, StatTilesRowComponent, RecentNotesListComponent, UpcomingTasksWidgetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly auth = inject(AuthService);

  constructor() {
    inject(SeoService).update('Home', 'Your notes, tasks, and assignments at a glance.');
  }

  protected readonly eyebrow = EYEBROW_FORMAT.format(new Date());

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const firstName = this.auth.currentUser()?.displayName.split(' ')[0] ?? 'there';
    return `Good ${timeOfDay}, ${firstName}.`;
  });

  protected readonly subtext = computed(() => {
    const now = Date.now();
    const dueSoon = this.assignmentsService
      .assignmentsDecorated()
      .filter((a) => a.status !== 'Complete' && new Date(a.due).getTime() - now < SOON_MS);

    if (dueSoon.length === 0) {
      return 'Nothing urgent on your plate today — a good moment to get ahead on something.';
    }
    const nearest = [...dueSoon].sort((a, b) => (a.due < b.due ? -1 : 1))[0];
    return `${dueSoon.length} item${dueSoon.length === 1 ? ' is' : 's are'} due soon, and “${nearest.title}” is ${nearest.percentComplete}% done.`;
  });
}
