import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AssignmentsRepository } from './assignments.repository';
import { Assignment } from '../models/assignment.model';
import { Task } from '../models/task.model';
import { LocalStorageService } from '../../../core/persistence/local-storage.service';

const STORAGE_KEY = 'assignments';

@Injectable()
export class LocalAssignmentsRepository implements AssignmentsRepository {
  private readonly storage = inject(LocalStorageService);

  getAll(): Observable<Assignment[]> {
    return of(this.storage.get<Assignment[]>(STORAGE_KEY) ?? []);
  }

  addTask(assignmentId: string, task: Task): Observable<Assignment> {
    return this.mutateAssignment(assignmentId, (assignment) => ({
      ...assignment,
      tasks: [...assignment.tasks, task],
    }));
  }

  updateTask(assignmentId: string, taskId: string, changes: Partial<Task>): Observable<Assignment> {
    return this.mutateAssignment(assignmentId, (assignment) => ({
      ...assignment,
      tasks: assignment.tasks.map((t) => (t.id === taskId ? { ...t, ...changes } : t)),
    }));
  }

  seed(assignments: Assignment[]): void {
    this.storage.set(STORAGE_KEY, assignments);
  }

  private mutateAssignment(
    assignmentId: string,
    mutate: (assignment: Assignment) => Assignment,
  ): Observable<Assignment> {
    const assignments = this.storage.get<Assignment[]>(STORAGE_KEY) ?? [];
    const index = assignments.findIndex((a) => a.id === assignmentId);
    if (index === -1) {
      return throwError(() => new Error(`Assignment "${assignmentId}" does not exist.`));
    }
    const updated = mutate(assignments[index]);
    const next = [...assignments];
    next[index] = updated;
    this.storage.set(STORAGE_KEY, next);
    return of(updated);
  }
}
