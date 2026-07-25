import { Injectable, computed, inject, signal } from '@angular/core';
import { NotesRepository } from '../data/notes.repository';
import { Note } from '../models/note.model';
import { ToastService } from '../../../core/services/toast.service';
import { generateId } from '../../../shared/utils/id';

const byUpdatedDesc = (a: Note, b: Note) => (a.updatedAt < b.updatedAt ? 1 : -1);

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly repo = inject(NotesRepository);
  private readonly toast = inject(ToastService);

  private readonly _notes = signal<Note[]>([]);
  readonly notes = this._notes.asReadonly();

  readonly activeNotes = computed(() => this._notes().filter((n) => !n.archived));
  readonly archivedNotes = computed(() => this._notes().filter((n) => n.archived));
  readonly favoriteNotes = computed(() => this.activeNotes().filter((n) => n.fav));
  readonly pinnedNotes = computed(() => this.activeNotes().filter((n) => n.pinned));
  readonly recentNotes = computed(() => [...this.activeNotes()].sort(byUpdatedDesc).slice(0, 4));

  readonly totalCount = computed(() => this.activeNotes().length);
  readonly favoriteCount = computed(() => this.favoriteNotes().length);
  readonly archivedCount = computed(() => this.archivedNotes().length);

  constructor() {
    this.repo.getAll().subscribe((notes) => this._notes.set(notes));
  }

  findById(id: string): Note | undefined {
    return this._notes().find((n) => n.id === id);
  }

  create(partial?: Partial<Note>): Note {
    const note: Note = {
      id: generateId(),
      title: 'Untitled note',
      folder: partial?.folder ?? 'Fundraising',
      dot: 'var(--accent)',
      tags: [],
      excerpt: '',
      content: [],
      updatedAt: new Date().toISOString(),
      pinned: false,
      fav: false,
      archived: false,
      ...partial,
    };
    this.repo.create(note).subscribe((created) => {
      this._notes.update((notes) => [created, ...notes]);
      this.toast.show('Note created');
    });
    return note;
  }

  update(id: string, changes: Partial<Note>): void {
    const payload: Partial<Note> = { ...changes, updatedAt: new Date().toISOString() };
    this.repo.update(id, payload).subscribe((updated) => this.replace(updated));
  }

  togglePinned(id: string): void {
    const note = this.findById(id);
    if (!note) return;
    this.repo.update(id, { pinned: !note.pinned }).subscribe((updated) => this.replace(updated));
  }

  toggleFavorite(id: string): void {
    const note = this.findById(id);
    if (!note) return;
    this.repo.update(id, { fav: !note.fav }).subscribe((updated) => {
      this.replace(updated);
      this.toast.show(updated.fav ? 'Added to favorites' : 'Removed from favorites');
    });
  }

  archive(id: string): void {
    this.repo.update(id, { archived: true }).subscribe((updated) => {
      this.replace(updated);
      this.toast.show('Note archived');
    });
  }

  unarchive(id: string): void {
    this.repo.update(id, { archived: false }).subscribe((updated) => {
      this.replace(updated);
      this.toast.show('Note restored');
    });
  }

  remove(id: string): void {
    this.repo.remove(id).subscribe(() => {
      this._notes.update((notes) => notes.filter((n) => n.id !== id));
      this.toast.show('Note deleted');
    });
  }

  moveToFolder(id: string, folder: string): void {
    this.repo.update(id, { folder }).subscribe((updated) => {
      this.replace(updated);
      this.toast.show(`Moved to ${folder}`);
    });
  }

  addTag(id: string, tag: string): void {
    const note = this.findById(id);
    const trimmed = tag.trim();
    if (!note || !trimmed || note.tags.includes(trimmed)) return;
    this.repo.update(id, { tags: [...note.tags, trimmed] }).subscribe((updated) => this.replace(updated));
  }

  removeTag(id: string, tag: string): void {
    const note = this.findById(id);
    if (!note) return;
    this.repo.update(id, { tags: note.tags.filter((t) => t !== tag) }).subscribe((updated) => this.replace(updated));
  }

  toggleChecklistItem(noteId: string, blockId: string, itemId: string): void {
    const note = this.findById(noteId);
    if (!note) return;
    const content = note.content.map((block) => {
      if (block.id !== blockId || block.type !== 'checklist') return block;
      return {
        ...block,
        items: block.items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)),
      };
    });
    this.repo.update(noteId, { content }).subscribe((updated) => this.replace(updated));
  }

  private replace(updated: Note): void {
    this._notes.update((notes) => notes.map((n) => (n.id === updated.id ? updated : n)));
  }
}
