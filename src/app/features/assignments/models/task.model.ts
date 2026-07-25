export type TaskStatus = 'todo' | 'progress' | 'done';

export interface Task {
  readonly id: string;
  title: string;
  status: TaskStatus;
}
