import { Assignment } from '../models/assignment.model';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const daysFromNow = (d: number) => new Date(now + d * DAY).toISOString();

export const ASSIGNMENTS_SEED: Assignment[] = [
  {
    id: 'a1',
    title: 'Board deck — final draft',
    context: 'Fundraising',
    due: daysFromNow(3),
    hot: false,
    tasks: [
      { id: 'a1-t1', title: 'Draft metrics slide', status: 'done' },
      { id: 'a1-t2', title: 'Write narrative section', status: 'progress' },
      { id: 'a1-t3', title: 'Design the cover', status: 'todo' },
      { id: 'a1-t4', title: 'Review with CFO', status: 'todo' },
      { id: 'a1-t5', title: 'Export final PDF', status: 'todo' },
    ],
  },
  {
    id: 'a2',
    title: 'Investor data room',
    context: 'Fundraising',
    due: daysFromNow(6),
    hot: false,
    tasks: [
      { id: 'a2-t1', title: 'Upload cap table', status: 'done' },
      { id: 'a2-t2', title: 'Redact customer contracts', status: 'progress' },
      { id: 'a2-t3', title: 'Add cohort retention chart', status: 'todo' },
      { id: 'a2-t4', title: 'Grant lead investor access', status: 'todo' },
    ],
  },
  {
    id: 'a3',
    title: 'Security questionnaire — Acme',
    context: 'Sales',
    due: daysFromNow(1),
    hot: true,
    tasks: [
      { id: 'a3-t1', title: 'Answer data-residency section', status: 'done' },
      { id: 'a3-t2', title: 'Attach SOC 2 report', status: 'done' },
      { id: 'a3-t3', title: 'Legal sign-off', status: 'progress' },
    ],
  },
  {
    id: 'a4',
    title: 'Annual comp review packet',
    context: 'People',
    due: daysFromNow(20),
    hot: false,
    tasks: [
      { id: 'a4-t1', title: 'Pull leveling benchmarks', status: 'todo' },
      { id: 'a4-t2', title: 'Draft manager guidance doc', status: 'todo' },
      { id: 'a4-t3', title: 'Schedule calibration session', status: 'todo' },
    ],
  },
];
