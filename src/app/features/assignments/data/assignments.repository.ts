import { Observable } from 'rxjs';
import { Assignment } from '../models/assignment.model';
import { Task } from '../models/task.model';

export abstract class AssignmentsRepository {
  abstract getAll(): Observable<Assignment[]>;
  abstract create(assignment: Assignment): Observable<Assignment>;
  abstract remove(id: string): Observable<void>;
  abstract addTask(assignmentId: string, task: Task): Observable<Assignment>;
  abstract updateTask(
    assignmentId: string,
    taskId: string,
    changes: Partial<Task>,
  ): Observable<Assignment>;
  /** One-time seed write, used only by SeedService on first boot. */
  abstract seed(assignments: Assignment[]): void;
}
