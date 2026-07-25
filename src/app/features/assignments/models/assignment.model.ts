import { Task } from './task.model';

export interface Assignment {
  readonly id: string;
  title: string;
  /** Folder/category name this assignment belongs to — drives its context pill color. */
  context: string;
  /** ISO-8601 due date. */
  due: string;
  /** Urgent/at-risk flag — reddens the due date and progress bar when not yet complete. */
  hot: boolean;
  tasks: Task[];
}

export type AssignmentStatus = 'Not started' | 'In progress' | 'Complete';

export interface DecoratedAssignment extends Assignment {
  readonly percentComplete: number;
  readonly status: AssignmentStatus;
  readonly doneCount: number;
  readonly totalCount: number;
  readonly taskCountLabel: string;
  readonly tagBg: string;
  readonly tagColor: string;
  readonly statusBg: string;
  readonly statusColor: string;
  readonly barColor: string;
  readonly dueColor: string;
}

export interface UpcomingTask {
  readonly assignmentId: string;
  readonly assignmentTitle: string;
  readonly taskId: string;
  readonly title: string;
  readonly due: string;
  readonly hot: boolean;
}
