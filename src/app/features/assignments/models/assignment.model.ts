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
  readonly statusLine: string;
  readonly barColor: string;
  readonly trackColor: string;
  readonly dueColor: string;
  readonly atRisk: boolean;
  readonly badgeBg: string;
  readonly badgeColor: string;
  readonly riskLabel: string;
  readonly riskColor: string;
}

export interface UpcomingTask {
  readonly assignmentId: string;
  readonly assignmentTitle: string;
  readonly taskId: string;
  readonly title: string;
  readonly due: string;
  readonly hot: boolean;
}
