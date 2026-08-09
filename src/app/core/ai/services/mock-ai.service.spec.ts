import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MockAiService } from './mock-ai.service';
import { NotesService } from '../../../features/notes/services/notes.service';
import { AssignmentsService } from '../../../features/assignments/services/assignments.service';
import { NotesRepository } from '../../../features/notes/data/notes.repository';
import { AssignmentsRepository } from '../../../features/assignments/data/assignments.repository';
import { Note } from '../../../features/notes/models/note.model';
import { Assignment } from '../../../features/assignments/models/assignment.model';

class EmptyNotesRepository extends NotesRepository {
  notes: Note[] = [];
  getAll(): Observable<Note[]> {
    return of(this.notes);
  }
  create(note: Note): Observable<Note> {
    return of(note);
  }
  update(): Observable<Note> {
    throw new Error('unused');
  }
  remove(): Observable<void> {
    return of(undefined);
  }
  seed(): void {}
}

function makeNote(overrides: Partial<Note>): Note {
  return {
    id: overrides.id ?? 'n1',
    title: 'Note',
    folder: 'Fundraising',
    dot: 'var(--accent)',
    tags: [],
    excerpt: '',
    content: [],
    updatedAt: new Date().toISOString(),
    pinned: false,
    fav: false,
    archived: false,
    ...overrides,
  };
}

class EmptyAssignmentsRepository extends AssignmentsRepository {
  assignments: Assignment[] = [];
  getAll(): Observable<Assignment[]> {
    return of(this.assignments);
  }
  addTask(): Observable<Assignment> {
    throw new Error('unused');
  }
  updateTask(): Observable<Assignment> {
    throw new Error('unused');
  }
  seed(): void {}
}

describe('MockAiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        MockAiService,
        { provide: NotesRepository, useClass: EmptyNotesRepository },
        { provide: AssignmentsRepository, useClass: EmptyAssignmentsRepository },
      ],
    });
  });

  it('falls back to a calm default when there is no notable activity or deadline', (done) => {
    TestBed.inject(MockAiService)
      .getDailyDigest()
      .subscribe((digest) => {
        expect(digest).toContain('Nothing urgent');
        done();
      });
  });

  it('mentions an assignment due soon and its real completion percentage', (done) => {
    const assignmentsRepo = TestBed.inject(AssignmentsRepository) as EmptyAssignmentsRepository;
    assignmentsRepo.assignments = [
      {
        id: 'a1',
        title: 'Ship the thing',
        context: 'Product',
        due: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        hot: true,
        tasks: [
          { id: 't1', title: 'a', status: 'done' },
          { id: 't2', title: 'b', status: 'todo' },
        ],
      },
    ];

    TestBed.inject(AssignmentsService);
    TestBed.inject(MockAiService)
      .getDailyDigest()
      .subscribe((digest) => {
        expect(digest).toContain('Ship the thing');
        expect(digest).toContain('at risk');
        expect(digest).toContain('50%');
        done();
      });
  });

  describe('search / ask / chat', () => {
    beforeEach(() => {
      const notesRepo = TestBed.inject(NotesRepository) as EmptyNotesRepository;
      notesRepo.notes = [
        makeNote({
          id: 'n1',
          title: 'Pricing v2 experiment',
          tags: ['pricing'],
          excerpt: 'Cohort A converts higher.',
        }),
        makeNote({
          id: 'n2',
          title: 'Onboarding teardown',
          tags: ['ux'],
          excerpt: 'Drop-off after import step.',
        }),
        makeNote({ id: 'n3', title: 'Random note', tags: [], excerpt: 'Nothing related here.' }),
      ];
      TestBed.inject(NotesService);
    });

    it('searchNotes ranks notes by keyword overlap and excludes zero-score notes', (done) => {
      TestBed.inject(MockAiService)
        .searchNotes('pricing cohort')
        .subscribe((results) => {
          expect(results.map((r) => r.id)).toEqual(['n1']);
          expect(results[0].matchScore).toBeGreaterThan(0);
          done();
        });
    });

    it('searchNotes returns nothing for a blank query', (done) => {
      TestBed.inject(MockAiService)
        .searchNotes('   ')
        .subscribe((results) => {
          expect(results).toEqual([]);
          done();
        });
    });

    it('askQuestion cites the matching notes and returns their ids as sources', (done) => {
      TestBed.inject(MockAiService)
        .askQuestion('onboarding drop-off')
        .subscribe((answer) => {
          expect(answer.sourceNoteIds).toEqual(['n2']);
          expect(answer.text).toContain('Onboarding teardown');
          done();
        });
    });

    it('askQuestion gives a graceful no-match answer when nothing scores', (done) => {
      TestBed.inject(MockAiService)
        .askQuestion('quantum spreadsheet wizardry')
        .subscribe((answer) => {
          expect(answer.sourceNoteIds).toEqual([]);
          expect(answer.text).toContain("couldn't find");
          done();
        });
    });

    it('sendChatMessage replies citing the single best-matching note', (done) => {
      TestBed.inject(MockAiService)
        .sendChatMessage('tell me about pricing', [])
        .subscribe((message) => {
          expect(message.role).toBe('ai');
          expect(message.sourceNoteId).toBe('n1');
          expect(message.text).toContain('Pricing v2 experiment');
          done();
        });
    });
  });
});
