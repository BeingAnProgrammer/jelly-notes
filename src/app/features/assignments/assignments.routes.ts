import { Routes } from '@angular/router';

export const ASSIGNMENTS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/assignments-list.page').then((m) => m.AssignmentsListPage) },
  { path: ':id', loadComponent: () => import('./pages/assignment-detail.page').then((m) => m.AssignmentDetailPage) },
];
