import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { NoteCardComponent } from '../components/note-card/note-card.component';
import { NotesService } from '../services/notes.service';
import { NotesFilter } from '../models/note.model';
import { LocalStorageService } from '../../../core/persistence/local-storage.service';
import { SeoService } from '../../../core/seo/seo.service';

type NotesView = 'grid' | 'list';
const VIEW_KEY = 'notesView';

@Component({
  selector: 'app-notes-list-page',
  imports: [IconComponent, EmptyStateComponent, NoteCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes-list.page.html',
  styleUrl: './notes-list.page.scss',
})
export class NotesListPage {
  protected readonly notesService = inject(NotesService);
  private readonly storage = inject(LocalStorageService);
  private readonly seo = inject(SeoService);

  readonly filter = input<NotesFilter>('all');
  readonly folder = input<string>('');

  protected readonly view = signal<NotesView>(this.storage.get<NotesView>(VIEW_KEY) ?? 'grid');
  protected readonly gridCols = computed(() => (this.view() === 'grid' ? 'repeat(3, 1fr)' : '1fr'));

  protected readonly notesTitle = computed(() => {
    switch (this.filter()) {
      case 'favorites':
        return 'Favorites';
      case 'archive':
        return 'Archive';
      case 'folder':
        return this.folder() || 'Folder';
      default:
        return 'All notes';
    }
  });

  protected readonly baseNotes = computed(() => {
    switch (this.filter()) {
      case 'favorites':
        return this.notesService.favoriteNotes();
      case 'archive':
        return this.notesService.archivedNotes();
      case 'folder':
        return this.notesService.activeNotes().filter((n) => n.folder === this.folder());
      default:
        return this.notesService.activeNotes();
    }
  });

  protected readonly notesCount = computed(() => this.baseNotes().length);
  protected readonly pinnedNotes = computed(() =>
    this.filter() === 'all' ? this.baseNotes().filter((n) => n.pinned) : [],
  );
  protected readonly showPinned = computed(() => this.pinnedNotes().length > 0);
  protected readonly mainNotes = computed(() =>
    this.filter() === 'all' ? this.baseNotes().filter((n) => !n.pinned) : this.baseNotes(),
  );

  constructor() {
    effect(() => this.seo.update(this.notesTitle(), 'Browse, search, and organize your notes.'));
  }

  setView(view: NotesView): void {
    this.view.set(view);
    this.storage.set(VIEW_KEY, view);
  }
}
