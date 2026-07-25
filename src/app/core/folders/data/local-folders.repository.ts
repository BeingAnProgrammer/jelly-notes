import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoldersRepository } from './folders.repository';
import { Folder } from '../models/folder.model';
import { LocalStorageService } from '../../persistence/local-storage.service';

const STORAGE_KEY = 'folders';

@Injectable()
export class LocalFoldersRepository implements FoldersRepository {
  private readonly storage = inject(LocalStorageService);

  getAll(): Observable<Folder[]> {
    return of(this.storage.get<Folder[]>(STORAGE_KEY) ?? []);
  }

  create(folder: Folder): Observable<Folder> {
    const folders = this.storage.get<Folder[]>(STORAGE_KEY) ?? [];
    this.storage.set(STORAGE_KEY, [...folders, folder]);
    return of(folder);
  }

  seed(folders: Folder[]): void {
    this.storage.set(STORAGE_KEY, folders);
  }
}
