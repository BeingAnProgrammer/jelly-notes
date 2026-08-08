import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

interface PublicNavItem {
  readonly label: string;
  readonly path: string;
}

const NAV_ITEMS: readonly PublicNavItem[] = [
  { label: 'Notes', path: '/notes' },
  { label: 'Tasks', path: '/tasks' },
  { label: 'AI Search', path: '/ai-search' },
];

// The floating pill navbar shared by every public-facing page (welcome, notes, tasks,
// ai-search) — lifted out of the welcome page so it isn't redefined per page.
@Component({
  selector: 'app-public-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-nav.component.html',
  styleUrl: './public-nav.component.scss',
})
export class PublicNavComponent {
  protected readonly navItems = NAV_ITEMS;
}
