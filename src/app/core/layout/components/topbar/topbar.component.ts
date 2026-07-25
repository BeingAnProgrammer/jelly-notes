import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { CommandPaletteService } from '../../services/command-palette.service';
import { MobileNavService } from '../../services/mobile-nav.service';

const ROOT_LABELS: Record<string, string> = {
  dashboard: 'Home',
  notes: 'All notes',
  assignments: 'Assignments',
  search: 'AI search',
  settings: 'Settings',
};

@Component({
  selector: 'app-topbar',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  private readonly router = inject(Router);
  protected readonly paletteService = inject(CommandPaletteService);
  protected readonly mobileNav = inject(MobileNavService);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly crumbRoot = computed(() => {
    const segment = this.currentUrl().split('/').filter(Boolean)[0] ?? 'dashboard';
    return ROOT_LABELS[segment] ?? 'Home';
  });
}
