import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import gsap from 'gsap';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { PillComponent } from '../../../../shared/ui/pill/pill.component';
import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { NewFolderModalComponent } from '../new-folder-modal/new-folder-modal.component';
import { FoldersMenuComponent } from '../folders-menu/folders-menu.component';
import { NotesService } from '../../../../features/notes/services/notes.service';
import { NOTES_FILTER_LINK } from '../../../../features/notes/models/note.model';
import { AssignmentsService } from '../../../../features/assignments/services/assignments.service';
import { FoldersService } from '../../../folders/services/folders.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AppearanceService } from '../../../appearance/services/appearance.service';
import { CommandPaletteService } from '../../services/command-palette.service';
import { initialsOf } from '../../../../shared/utils/initials';

type NavId = 'home' | 'all' | 'assignments' | 'favorites' | 'archive';

interface NavEntry {
  readonly id: NavId;
  readonly label: string;
  readonly link: string;
  readonly queryParams?: Record<string, string>;
  readonly active: boolean;
  readonly badge?: number;
}

@Component({
  selector: 'app-top-nav',
  imports: [
    RouterLink,
    IconComponent,
    PillComponent,
    AvatarComponent,
    ClickOutsideDirective,
    NewFolderModalComponent,
    FoldersMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly notesService = inject(NotesService);
  private readonly assignmentsService = inject(AssignmentsService);
  protected readonly foldersService = inject(FoldersService);
  protected readonly auth = inject(AuthService);
  protected readonly appearance = inject(AppearanceService);
  protected readonly paletteService = inject(CommandPaletteService);

  private readonly navEl = viewChild<ElementRef<HTMLElement>>('nav');
  private readonly inkEl = viewChild<ElementRef<HTMLElement>>('ink');
  private hasPositionedInk = false;

  protected readonly foldersOpen = signal(false);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly folderModalOpen = signal(false);

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeFolder = computed(() => {
    const url = this.currentUrl();
    const match = /[?&]folder=([^&]+)/.exec(url);
    return url.startsWith('/notes') && url.includes('filter=folder') && match ? decodeURIComponent(match[1]) : null;
  });

  protected readonly navItems = computed<NavEntry[]>(() => {
    const url = this.currentUrl();
    const notesFilterActive = (activeFilter: string) =>
      url.startsWith('/notes') &&
      (url.includes(`filter=${activeFilter}`) || (activeFilter === 'all' && !url.includes('filter=')));

    return [
      { id: 'home', label: 'Home', link: '/dashboard', active: url.startsWith('/dashboard') },
      {
        id: 'all',
        label: 'All notes',
        ...NOTES_FILTER_LINK.all,
        active: notesFilterActive('all') || !!this.activeFolder(),
      },
      {
        id: 'assignments',
        label: 'Assignments',
        link: '/assignments',
        active: url.startsWith('/assignments'),
        badge: this.assignmentsService.openCount(),
      },
      {
        id: 'favorites',
        label: 'Favorites',
        ...NOTES_FILTER_LINK.favorites,
        active: notesFilterActive('favorites'),
      },
      {
        id: 'archive',
        label: 'Archive',
        ...NOTES_FILTER_LINK.archive,
        active: notesFilterActive('archive'),
      },
    ];
  });

  protected readonly folderLabel = computed(() => this.activeFolder() ?? 'All folders');
  protected readonly userInitials = computed(() => {
    const user = this.auth.currentUser();
    return user ? initialsOf(user.displayName) : '';
  });

  constructor() {
    effect(() => {
      // Re-measure whenever the active nav item changes.
      this.navItems();
      this.moveIndicator();
    });

    if (this.isBrowser) {
      this.document.defaultView?.addEventListener('resize', () => this.moveIndicator());
      // Google Fonts loads with font-display:swap — the nav's initial measurement can land
      // on fallback-font metrics before Schibsted Grotesk swaps in, leaving the indicator
      // sized/positioned for text that has since reflowed. Re-measure once the real font lands.
      this.document.fonts?.ready.then(() => this.moveIndicator());
    }
  }

  private moveIndicator(): void {
    if (!this.isBrowser) return;
    queueMicrotask(() => {
      const nav = this.navEl()?.nativeElement;
      const ink = this.inkEl()?.nativeElement;
      if (!nav || !ink) return;
      const activeId = this.navItems().find((item) => item.active)?.id ?? 'all';
      const target = nav.querySelector<HTMLElement>(`[data-nav="${activeId}"]`);
      if (!target) return;
      // getBoundingClientRect (not offsetLeft) on purpose: each nav item sits inside its own
      // `position: relative` wrapper (for the folders popover), which would otherwise reset
      // offsetLeft's reference frame to that wrapper instead of the nav bar.
      const navRect = nav.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const to = { x: targetRect.left - navRect.left, width: targetRect.width, opacity: 1 };

      gsap.killTweensOf(ink);
      const animate = this.hasPositionedInk;
      this.hasPositionedInk = true;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (animate) {
          gsap.to(ink, { x: to.x, width: to.width, opacity: to.opacity, duration: 0.4, ease: 'power3.out' });
        } else {
          gsap.set(ink, to);
        }
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ink, to);
      });
    });
  }

  protected isFolderActive(name: string): boolean {
    return this.activeFolder() === name;
  }

  protected selectFolder(name: string): void {
    this.foldersOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/notes'], { queryParams: { filter: 'folder', folder: name } });
  }

  protected clearFolder(): void {
    this.foldersOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.router.navigate([NOTES_FILTER_LINK.all.link], { queryParams: NOTES_FILTER_LINK.all.queryParams });
  }

  protected createNote(): void {
    this.mobileMenuOpen.set(false);
    const note = this.notesService.create();
    this.router.navigate(['/notes', note.id]);
  }
}
