import { Observable } from 'rxjs';
import { Folder } from '../models/folder.model';

/**
 * Abstract class used as both the type and the DI token, so a future remote implementation
 * (real HttpClient calls) can be swapped in via a single `useClass` change in app.config.ts
 * with zero changes at any call site.
 */
export abstract class FoldersRepository {
  abstract getAll(): Observable<Folder[]>;
  abstract create(folder: Folder): Observable<Folder>;
  /** One-time seed write, used only by SeedService on first boot. */
  abstract seed(folders: Folder[]): void;
}
