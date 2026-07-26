import { Routes } from '@angular/router';
import { authGuard, redirectIfSignedInGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/components/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'notes',
        loadChildren: () => import('./features/notes/notes.routes').then((m) => m.NOTES_ROUTES),
      },
      {
        path: 'assignments',
        loadChildren: () => import('./features/assignments/assignments.routes').then((m) => m.ASSIGNMENTS_ROUTES),
      },
      {
        path: 'search',
        loadComponent: () => import('./features/ai-search/pages/ai-search.page').then((m) => m.AiSearchPage),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
    ],
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/auth/pages/sign-in.page').then((m) => m.SignInPage),
    canActivate: [redirectIfSignedInGuard],
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/auth/pages/sign-in-form.page').then((m) => m.SignInFormPage),
    canActivate: [redirectIfSignedInGuard],
  },
  {
    path: 'guest',
    loadComponent: () => import('./features/auth/pages/guest-name.page').then((m) => m.GuestNamePage),
    canActivate: [redirectIfSignedInGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/pages/not-found.page').then((m) => m.NotFoundPage),
  },
];
