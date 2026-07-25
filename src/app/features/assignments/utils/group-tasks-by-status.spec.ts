import { groupTasksByStatus } from './group-tasks-by-status';
import { Task } from '../models/task.model';

describe('groupTasksByStatus', () => {
  it('buckets tasks by status, preserving order within each bucket', () => {
    const tasks: Task[] = [
      { id: 't1', title: 'a', status: 'todo' },
      { id: 't2', title: 'b', status: 'done' },
      { id: 't3', title: 'c', status: 'progress' },
      { id: 't4', title: 'd', status: 'todo' },
    ];

    const grouped = groupTasksByStatus(tasks);

    expect(grouped.todo.map((t) => t.id)).toEqual(['t1', 't4']);
    expect(grouped.progress.map((t) => t.id)).toEqual(['t3']);
    expect(grouped.done.map((t) => t.id)).toEqual(['t2']);
  });

  it('returns empty arrays for statuses with no tasks', () => {
    const grouped = groupTasksByStatus([]);
    expect(grouped).toEqual({ todo: [], progress: [], done: [] });
  });
});
