import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FoldersService } from './folders.service';
import { FoldersRepository } from '../data/folders.repository';
import { Folder } from '../models/folder.model';
import { NotesRepository } from '../../../features/notes/data/notes.repository';
import { Note } from '../../../features/notes/models/note.model';

function makeNote(folder: string, archived = false): Note {
  return {
    id: folder + Math.random(),
    title: 't',
    folder,
    dot: 'var(--accent)',
    tags: [],
    excerpt: '',
    content: [],
    updatedAt: new Date().toISOString(),
    pinned: false,
    fav: false,
    archived,
  };
}

class FakeFoldersRepository extends FoldersRepository {
  folders: Folder[] = [{ name: 'Growth', color: 'var(--gold)' }];
  getAll(): Observable<Folder[]> {
    return of(this.folders);
  }
  create(folder: Folder): Observable<Folder> {
    this.folders = [...this.folders, folder];
    return of(folder);
  }
  seed(): void {}
}

class FakeNotesRepository extends NotesRepository {
  getAll(): Observable<Note[]> {
    return of([makeNote('Growth'), makeNote('Growth'), makeNote('Growth', true), makeNote('Product')]);
  }
  create(note: Note): Observable<Note> {
    return of(note);
  }
  update(): Observable<Note> {
    throw new Error('not used in this spec');
  }
  remove(): Observable<void> {
    return of(undefined);
  }
  seed(): void {}
}

describe('FoldersService', () => {
  let service: FoldersService;
  let repo: FakeFoldersRepository;

  beforeEach(() => {
    repo = new FakeFoldersRepository();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: FoldersRepository, useValue: repo },
        { provide: NotesRepository, useClass: FakeNotesRepository },
      ],
    });
    service = TestBed.inject(FoldersService);
  });

  it('derives folder note counts from active (non-archived) notes only', () => {
    const growth = service.foldersWithCounts().find((f) => f.name === 'Growth');
    expect(growth?.count).toBe(2);
  });

  it('create() adds a new folder and persists it through the repository', () => {
    const created = service.create('Legal', 'var(--warm)');
    expect(created).toEqual({ name: 'Legal', color: 'var(--warm)' });
    expect(service.folders().map((f) => f.name)).toContain('Legal');
    expect(repo.folders.map((f) => f.name)).toContain('Legal');
  });

  it('create() rejects a duplicate name case-insensitively and does not touch the repository', () => {
    const result = service.create('growth', 'var(--accent)');
    expect(result).toBeNull();
    expect(repo.folders.length).toBe(1);
  });

  it('create() rejects a blank name', () => {
    expect(service.create('   ', 'var(--accent)')).toBeNull();
  });
});
