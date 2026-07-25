import { Task, TaskStatus } from '../models/task.model';

export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  return {
    todo: tasks.filter((t) => t.status === 'todo'),
    progress: tasks.filter((t) => t.status === 'progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };
}
