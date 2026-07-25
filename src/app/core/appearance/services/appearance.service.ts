import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from '../../persistence/local-storage.service';

export type Theme = 'dark' | 'light';

const THEME_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
  private readonly storage = inject(LocalStorageService);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _theme = signal<Theme>(this.storage.get<Theme>(THEME_KEY) ?? 'dark');
  readonly theme = this._theme.asReadonly();

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;
      this.document.documentElement.setAttribute('data-theme', this._theme());
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.storage.set(THEME_KEY, theme);
  }

  toggleTheme(): void {
    this.setTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }
}
