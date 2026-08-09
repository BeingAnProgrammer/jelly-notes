import { Assignment } from '../models/assignment.model';

/**
 * A new user starts with no assignments — the UI has no "create assignment" flow yet (only
 * "add a task to an existing assignment"), so this stays empty until that ships; the
 * assignments list's existing empty state covers this, no fake records needed to fill it.
 */
export const ASSIGNMENTS_SEED: Assignment[] = [];
