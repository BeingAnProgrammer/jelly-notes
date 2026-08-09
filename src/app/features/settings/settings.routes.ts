import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/settings-layout.page').then((m) => m.SettingsLayoutPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'account' },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account-settings.page').then((m) => m.AccountSettingsPage),
      },
      {
        path: 'appearance',
        loadComponent: () =>
          import('./pages/appearance-settings.page').then((m) => m.AppearanceSettingsPage),
      },
    ],
  },
];
