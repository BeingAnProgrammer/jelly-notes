import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { IconName } from '../../../../shared/ui/icon/icon.types';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { CommandPaletteService } from '../../services/command-palette.service';
import { NotesService } from '../../../../features/notes/services/notes.service';
import { NOTES_FILTER_LINK } from '../../../../features/notes/models/note.model';
import { AppearanceService } from '../../../appearance/services/appearance.service';

interface ActionItem {
  readonly label: string;
  readonly icon: IconName;
  readonly hint?: string;
  readonly run: () => void;
}

interface NoteItem {
  readonly id: string;
  readonly label: string;
  readonly meta: string;
}

type FlatItem =
  | { readonly kind: 'action'; readonly action: ActionItem }
  | { readonly kind: 'note'; readonly note: NoteItem }
  | { readonly kind: 'ask-ai'; readonly query: string };

@Component({
  selector: 'app-command-palette',
  imports: [IconComponent, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
})
export class CommandPaletteComponent implements AfterViewInit {
  protected readonly paletteService = inject(CommandPaletteService);
  private readonly notesService = inject(NotesService);
  private readonly appearance = inject(AppearanceService);
  private readonly router = inject(Router);

  @ViewChild('searchInput') private readonly searchInputRef?: ElementRef<HTMLInputElement>;

  protected readonly query = signal('');
  protected readonly highlightedIndex = signal(0);

  private readonly actions = computed<ActionItem[]>(() => [
    { label: 'New note', icon: 'plus', hint: 'N', run: () => this.createNote() },
    { label: 'Go to Home', icon: 'home', run: () => this.router.navigate(['/app/dashboard']) },
    {
      label: 'Go to All notes',
      icon: 'file',
      run: () =>
        this.router.navigate([NOTES_FILTER_LINK.all.link], {
          queryParams: NOTES_FILTER_LINK.all.queryParams,
        }),
    },
    {
      label: 'Go to Favorites',
      icon: 'star',
      run: () =>
        this.router.navigate([NOTES_FILTER_LINK.favorites.link], {
          queryParams: NOTES_FILTER_LINK.favorites.queryParams,
        }),
    },
    {
      label: 'Go to Archive',
      icon: 'archive',
      run: () =>
        this.router.navigate([NOTES_FILTER_LINK.archive.link], {
          queryParams: NOTES_FILTER_LINK.archive.queryParams,
        }),
    },
    {
      label: 'Go to Assignments',
      icon: 'cap',
      run: () => this.router.navigate(['/app/assignments']),
    },
    { label: 'Toggle theme', icon: 'sun', run: () => this.appearance.toggleTheme() },
  ]);

  protected readonly filteredActions = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.actions().filter((a) => !q || a.label.toLowerCase().includes(q));
  });

  protected readonly noteItems = computed<NoteItem[]>(() => {
    const q = this.query().trim().toLowerCase();
    const source = q
      ? this.notesService.activeNotes().filter((n) => n.title.toLowerCase().includes(q))
      : this.notesService.recentNotes();
    return source.slice(0, 5).map((n) => ({ id: n.id, label: n.title, meta: n.folder }));
  });

  protected readonly askAiQuery = computed(() => this.query().trim());

  protected readonly notesStartIndex = computed(() => this.filteredActions().length);
  protected readonly askAiIndex = computed(
    () => this.filteredActions().length + this.noteItems().length,
  );

  protected readonly flatItems = computed<FlatItem[]>(() => {
    const items: FlatItem[] = [
      ...this.filteredActions().map((action) => ({ kind: 'action' as const, action })),
      ...this.noteItems().map((note) => ({ kind: 'note' as const, note })),
    ];
    if (this.askAiQuery()) items.push({ kind: 'ask-ai', query: this.askAiQuery() });
    return items;
  });

  ngAfterViewInit(): void {
    this.searchInputRef?.nativeElement.focus();
  }

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.highlightedIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.flatItems().length;
    if (count === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex.update((i) => (i + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex.update((i) => (i - 1 + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.activate(this.flatItems()[this.highlightedIndex()]);
    }
  }

  protected activate(item: FlatItem | undefined): void {
    if (!item) return;
    if (item.kind === 'action') item.action.run();
    else if (item.kind === 'note') this.router.navigate(['/app/notes', item.note.id]);
    else this.router.navigate(['/app/search'], { queryParams: { q: item.query } });
    this.paletteService.close();
  }

  private createNote(): void {
    const note = this.notesService.create();
    this.router.navigate(['/app/notes', note.id]);
  }
}
