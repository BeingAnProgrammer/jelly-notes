import { Injectable, computed, inject, signal } from '@angular/core';
import { FoldersRepository } from '../data/folders.repository';
import { Folder, FolderWithCount } from '../models/folder.model';
import { NotesService } from '../../../features/notes/services/notes.service';
import { ToastService } from '../../services/toast.service';

@Injectable({ providedIn: 'root' })
export class FoldersService {
  private readonly repo = inject(FoldersRepository);
  private readonly notes = inject(NotesService);
  private readonly toast = inject(ToastService);

  private readonly _folders = signal<Folder[]>([]);
  readonly folders = this._folders.asReadonly();

  readonly foldersWithCounts = computed<FolderWithCount[]>(() =>
    this._folders().map((folder) => ({
      ...folder,
      count: this.notes.activeNotes().filter((n) => n.folder === folder.name).length,
    })),
  );

  constructor() {
    this.repo.getAll().subscribe((folders) => this._folders.set(folders));
  }

  /** Returns the created folder, or null if a folder with that name (case-insensitive) already exists. */
  create(name: string, color: string): Folder | null {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const exists = this._folders().some((f) => f.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) return null;

    const folder: Folder = { name: trimmed, color };
    this.repo.create(folder).subscribe((created) => {
      this._folders.update((folders) => [...folders, created]);
      this.toast.show('Folder created');
    });
    return folder;
  }
}
