import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { FoldersRepository } from '../folders/data/folders.repository';
import { FOLDERS_SEED } from '../folders/data/folders.seed-data';
import { NotesRepository } from '../../features/notes/data/notes.repository';
import { NOTES_SEED } from '../../features/notes/data/notes.seed-data';
import { AssignmentsRepository } from '../../features/assignments/data/assignments.repository';
import { ASSIGNMENTS_SEED } from '../../features/assignments/data/assignments.seed-data';

const SEEDED_KEY = 'seeded';

/**
 * Seeds demo data exactly once per browser, gated by a persisted flag rather than "collection
 * is empty" — the latter would resurrect demo notes/folders/assignments after a user genuinely
 * deletes everything.
 */
@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly storage = inject(LocalStorageService);
  private readonly foldersRepo = inject(FoldersRepository);
  private readonly notesRepo = inject(NotesRepository);
  private readonly assignmentsRepo = inject(AssignmentsRepository);

  ensureSeeded(): void {
    if (this.storage.get<boolean>(SEEDED_KEY)) return;

    this.foldersRepo.seed(FOLDERS_SEED);
    this.notesRepo.seed(NOTES_SEED);
    this.assignmentsRepo.seed(ASSIGNMENTS_SEED);

    this.storage.set(SEEDED_KEY, true);
  }
}
