import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { IconName } from '../../../../shared/ui/icon/icon.types';
import { PillComponent } from '../../../../shared/ui/pill/pill.component';
import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { NewFolderModalComponent } from '../new-folder-modal/new-folder-modal.component';
import { NotesService } from '../../../../features/notes/services/notes.service';
import { AssignmentsService } from '../../../../features/assignments/services/assignments.service';
import { FoldersService } from '../../../folders/services/folders.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommandPaletteService } from '../../services/command-palette.service';
import { MobileNavService } from '../../services/mobile-nav.service';
import { initialsOf } from '../../../../shared/utils/initials';

interface NavEntry {
  readonly id: string;
  readonly label: string;
  readonly icon: IconName;
  readonly link: string;
  readonly queryParams?: Record<string, string>;
  readonly active: boolean;
  readonly badge?: number;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, IconComponent, PillComponent, AvatarComponent, NewFolderModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly notesService = inject(NotesService);
  private readonly assignmentsService = inject(AssignmentsService);
  protected readonly foldersService = inject(FoldersService);
  protected readonly auth = inject(AuthService);
  protected readonly paletteService = inject(CommandPaletteService);
  protected readonly mobileNav = inject(MobileNavService);

  protected readonly folderModalOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly navItems = computed<NavEntry[]>(() => {
    const url = this.currentUrl();
    const notesFilterActive = (activeFilter: string) =>
      url.startsWith('/notes') &&
      (url.includes(`filter=${activeFilter}`) || (activeFilter === 'all' && !url.includes('filter=')));

    return [
      { id: 'home', label: 'Home', icon: 'home', link: '/dashboard', active: url.startsWith('/dashboard') },
      {
        id: 'notes',
        label: 'All notes',
        icon: 'file',
        link: '/notes',
        queryParams: { filter: 'all' },
        active: notesFilterActive('all'),
      },
      {
        id: 'assignments',
        label: 'Assignments',
        icon: 'cap',
        link: '/assignments',
        active: url.startsWith('/assignments'),
        badge: this.assignmentsService.openCount(),
      },
      {
        id: 'favorites',
        label: 'Favorites',
        icon: 'star',
        link: '/notes',
        queryParams: { filter: 'favorites' },
        active: notesFilterActive('favorites'),
      },
      {
        id: 'archive',
        label: 'Archive',
        icon: 'archive',
        link: '/notes',
        queryParams: { filter: 'archive' },
        active: notesFilterActive('archive'),
      },
    ];
  });

  protected readonly userInitials = computed(() => {
    const user = this.auth.currentUser();
    return user ? initialsOf(user.displayName) : '';
  });

  protected isFolderActive(name: string): boolean {
    const url = this.currentUrl();
    return url.startsWith('/notes') && url.includes('filter=folder') && url.includes(`folder=${encodeURIComponent(name)}`);
  }

  createNote(): void {
    const note = this.notesService.create();
    this.router.navigate(['/notes', note.id]);
  }
}
