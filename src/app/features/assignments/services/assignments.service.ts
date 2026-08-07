import { Injectable, computed, inject, signal } from '@angular/core';
import { AssignmentsRepository } from '../data/assignments.repository';
import { Assignment, AssignmentStatus, DecoratedAssignment, UpcomingTask } from '../models/assignment.model';
import { Task, TaskStatus } from '../models/task.model';
import { generateId } from '../../../shared/utils/id';

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'progress',
  progress: 'done',
  done: 'todo',
};

const CONTEXT_COLORS: Record<string, { bg: string; color: string }> = {
  Fundraising: { bg: 'var(--accent-soft)', color: 'var(--accent-ink)' },
  Sales: { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  People: { bg: 'var(--ink-blue-soft)', color: 'var(--ink-blue)' },
  Product: { bg: 'var(--mint-soft)', color: 'var(--mint)' },
};
const DEFAULT_CONTEXT_COLOR = { bg: 'var(--canvas-sub)', color: 'var(--ink-3)' };

function statusOf(tasks: Task[]): AssignmentStatus {
  if (tasks.length === 0) return 'Not started';
  if (tasks.every((t) => t.status === 'done')) return 'Complete';
  if (tasks.some((t) => t.status === 'done' || t.status === 'progress')) return 'In progress';
  return 'Not started';
}

function decorate(assignment: Assignment): DecoratedAssignment {
  const doneCount = assignment.tasks.filter((t) => t.status === 'done').length;
  const totalCount = assignment.tasks.length;
  const percentComplete = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const status = statusOf(assignment.tasks);
  const context = CONTEXT_COLORS[assignment.context] ?? DEFAULT_CONTEXT_COLOR;
  const atRisk = assignment.hot && percentComplete < 100;

  // Matches the design's status-pill rule exactly: at-risk always wins, otherwise a
  // not-yet-started assignment reads neutral (slate) and anything actively moving reads
  // positive (mint) — status alone (not just the 3-value enum) never determines the color.
  const statusColor = atRisk ? 'var(--warm)' : status === 'Not started' ? 'var(--slate)' : 'var(--mint)';
  const statusBg = atRisk ? 'var(--warm-soft)' : status === 'Not started' ? 'var(--slate-soft)' : 'var(--mint-soft)';
  const statusLine = atRisk ? 'var(--warm-line)' : status === 'Not started' ? 'var(--slate-line)' : 'var(--mint-line)';

  return {
    ...assignment,
    doneCount,
    totalCount,
    percentComplete,
    status,
    atRisk,
    taskCountLabel: `${doneCount}/${totalCount}`,
    tagBg: context.bg,
    tagColor: context.color,
    statusBg,
    statusColor,
    statusLine,
    barColor: atRisk ? 'var(--warm)' : 'var(--accent)',
    trackColor: atRisk ? 'var(--warm-soft)' : 'var(--accent-soft)',
    badgeBg: atRisk ? 'var(--warm-soft)' : 'var(--accent-soft)',
    badgeColor: atRisk ? 'var(--warm)' : 'var(--accent-ink)',
    dueColor: assignment.hot ? 'var(--warm)' : 'var(--ink-4)',
    riskLabel: atRisk ? 'Behind schedule' : 'On track',
    riskColor: atRisk ? 'var(--warm)' : 'var(--ink-3)',
  };
}

@Injectable({ providedIn: 'root' })
export class AssignmentsService {
  private readonly repo = inject(AssignmentsRepository);

  private readonly _assignments = signal<Assignment[]>([]);
  readonly assignments = this._assignments.asReadonly();

  readonly assignmentsDecorated = computed(() => this._assignments().map(decorate));

  readonly openCount = computed(() => this._assignments().filter((a) => statusOf(a.tasks) !== 'Complete').length);

  /** Nearest-due, not-yet-done tasks across every assignment — backs the dashboard widget. */
  readonly upcomingTasks = computed<UpcomingTask[]>(() =>
    this.assignmentsDecorated()
      .flatMap((assignment) =>
        assignment.tasks
          .filter((t) => t.status !== 'done')
          .map((t) => ({
            assignmentId: assignment.id,
            assignmentTitle: assignment.title,
            taskId: t.id,
            title: t.title,
            due: assignment.due,
            hot: assignment.hot,
          })),
      )
      .sort((a, b) => (a.due < b.due ? -1 : 1))
      .slice(0, 4),
  );

  constructor() {
    this.repo.getAll().subscribe((assignments) => this._assignments.set(assignments));
  }

  findById(id: string): Assignment | undefined {
    return this._assignments().find((a) => a.id === id);
  }

  addTask(assignmentId: string, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const task: Task = { id: generateId(), title: trimmed, status: 'todo' };
    this.repo.addTask(assignmentId, task).subscribe((updated) => this.replace(updated));
  }

  advanceTaskStatus(assignmentId: string, taskId: string): void {
    const assignment = this.findById(assignmentId);
    const task = assignment?.tasks.find((t) => t.id === taskId);
    if (!task) return;
    this.repo
      .updateTask(assignmentId, taskId, { status: NEXT_STATUS[task.status] })
      .subscribe((updated) => this.replace(updated));
  }

  private replace(updated: Assignment): void {
    this._assignments.update((assignments) => assignments.map((a) => (a.id === updated.id ? updated : a)));
  }
}
