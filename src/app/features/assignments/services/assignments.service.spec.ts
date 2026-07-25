import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AssignmentsService } from './assignments.service';
import { AssignmentsRepository } from '../data/assignments.repository';
import { Assignment } from '../models/assignment.model';
import { Task } from '../models/task.model';

function makeAssignment(overrides: Partial<Assignment> = {}): Assignment {
  return {
    id: 'a1',
    title: 'Test assignment',
    context: 'Fundraising',
    due: new Date(Date.now() + 86_400_000).toISOString(),
    hot: false,
    tasks: [],
    ...overrides,
  };
}

class FakeAssignmentsRepository extends AssignmentsRepository {
  assignments: Assignment[] = [
    makeAssignment({
      id: 'a1',
      tasks: [
        { id: 't1', title: 'One', status: 'done' },
        { id: 't2', title: 'Two', status: 'todo' },
      ],
    }),
  ];

  getAll(): Observable<Assignment[]> {
    return of(this.assignments);
  }

  addTask(assignmentId: string, task: Task): Observable<Assignment> {
    return this.mutate(assignmentId, (a) => ({ ...a, tasks: [...a.tasks, task] }));
  }

  updateTask(assignmentId: string, taskId: string, changes: Partial<Task>): Observable<Assignment> {
    return this.mutate(assignmentId, (a) => ({
      ...a,
      tasks: a.tasks.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
    }));
  }

  seed(): void {}

  private mutate(id: string, fn: (a: Assignment) => Assignment): Observable<Assignment> {
    const index = this.assignments.findIndex((a) => a.id === id);
    if (index === -1) return throwError(() => new Error('not found'));
    const updated = fn(this.assignments[index]);
    this.assignments = this.assignments.map((a) => (a.id === id ? updated : a));
    return of(updated);
  }
}

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let repo: FakeAssignmentsRepository;

  beforeEach(() => {
    repo = new FakeAssignmentsRepository();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: AssignmentsRepository, useValue: repo }],
    });
    service = TestBed.inject(AssignmentsService);
  });

  it('decorates percentComplete and status from the task list', () => {
    const decorated = service.assignmentsDecorated()[0];
    expect(decorated.percentComplete).toBe(50);
    expect(decorated.status).toBe('In progress');
    expect(decorated.taskCountLabel).toBe('1/2');
  });

  it('advanceTaskStatus cycles todo -> progress -> done -> todo', () => {
    service.advanceTaskStatus('a1', 't2');
    expect(service.findById('a1')?.tasks.find((t) => t.id === 't2')?.status).toBe('progress');

    service.advanceTaskStatus('a1', 't2');
    expect(service.findById('a1')?.tasks.find((t) => t.id === 't2')?.status).toBe('done');

    service.advanceTaskStatus('a1', 't2');
    expect(service.findById('a1')?.tasks.find((t) => t.id === 't2')?.status).toBe('todo');
  });

  it('addTask appends a new todo task and ignores blank input', () => {
    service.addTask('a1', 'Three');
    expect(service.findById('a1')?.tasks.at(-1)).toEqual(jasmine.objectContaining({ title: 'Three', status: 'todo' }));

    const countBefore = service.findById('a1')?.tasks.length;
    service.addTask('a1', '   ');
    expect(service.findById('a1')?.tasks.length).toBe(countBefore);
  });

  it('upcomingTasks excludes done tasks and sorts by nearest due date', () => {
    const upcoming = service.upcomingTasks();
    expect(upcoming.every((t) => t.taskId !== 't1')).toBe(true);
    expect(upcoming.map((t) => t.taskId)).toContain('t2');
  });

  it('marks an assignment complete once every task is done', () => {
    service.advanceTaskStatus('a1', 't2'); // -> progress
    service.advanceTaskStatus('a1', 't2'); // -> done
    expect(service.assignmentsDecorated()[0].status).toBe('Complete');
    expect(service.assignmentsDecorated()[0].percentComplete).toBe(100);
  });
});
