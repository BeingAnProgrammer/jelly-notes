import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Thin, SSR-safe wrapper around window.localStorage. Every key is namespaced under `memora.`
 * so the app never collides with other data a browser tab might hold, and every read/write
 * is a no-op on the server (guest data only ever exists client-side).
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private static readonly PREFIX = 'memora.';

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(LocalStorageService.PREFIX + key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(LocalStorageService.PREFIX + key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(LocalStorageService.PREFIX + key);
  }
}
