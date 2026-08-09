import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AssignmentDetailPage } from './assignment-detail.page';
import { AssignmentsRepository } from '../data/assignments.repository';
import { Assignment } from '../models/assignment.model';
import { Task } from '../models/task.model';

class FakeAssignmentsRepository extends AssignmentsRepository {
  assignments: Assignment[] = [
    {
      id: 'a1',
      title: 'Board deck',
      context: 'Fundraising',
      due: new Date(Date.now() + 86_400_000).toISOString(),
      hot: false,
      tasks: [
        { id: 't1', title: 'Draft slide', status: 'done' },
        { id: 't2', title: 'Write narrative', status: 'progress' },
        { id: 't3', title: 'Design cover', status: 'todo' },
      ],
    },
  ];

  getAll(): Observable<Assignment[]> {
    return of(this.assignments);
  }

  create(assignment: Assignment): Observable<Assignment> {
    this.assignments = [...this.assignments, assignment];
    return of(assignment);
  }

  remove(id: string): Observable<void> {
    this.assignments = this.assignments.filter((a) => a.id !== id);
    return of(undefined);
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

describe('AssignmentDetailPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignmentDetailPage],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AssignmentsRepository, useClass: FakeAssignmentsRepository },
      ],
    });
  });

  function create(id = 'a1') {
    const fixture = TestBed.createComponent(AssignmentDetailPage);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('groups tasks into the right kanban columns', () => {
    const page = create();
    const columns = page['columns']();
    expect(columns.todo.map((t) => t.id)).toEqual(['t3']);
    expect(columns.progress.map((t) => t.id)).toEqual(['t2']);
    expect(columns.done.map((t) => t.id)).toEqual(['t1']);
  });

  it('is undefined for an id that does not exist', () => {
    const page = create('missing');
    expect(page['assignment']()).toBeUndefined();
  });

  it('addTask appends a new todo task and clears the input', () => {
    const page = create();
    const input = document.createElement('input');
    input.value = '  New task  ';
    page.addTask(input);

    expect(page['columns']().todo.map((t) => t.title)).toContain('New task');
    expect(input.value).toBe('');
  });

  it('addTask ignores blank input', () => {
    const page = create();
    const input = document.createElement('input');
    input.value = '   ';
    page.addTask(input);
    expect(page['assignment']()?.tasks.length).toBe(3);
  });

  it('advanceTask cycles a task and updates percentComplete', () => {
    const page = create();
    expect(page['assignment']()?.percentComplete).toBe(33);

    page.advanceTask('t3'); // todo -> progress
    expect(page['columns']().progress.map((t) => t.id)).toEqual(['t2', 't3']);

    page.advanceTask('t3'); // progress -> done
    expect(page['columns']().done.map((t) => t.id)).toEqual(['t1', 't3']);
    expect(page['assignment']()?.percentComplete).toBe(67);
  });
});
