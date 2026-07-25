import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommandPaletteService {
  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  constructor() {
    const document = inject(DOCUMENT);
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault();
          this.toggle();
        } else if (event.key === 'Escape' && this._isOpen()) {
          this.close();
        }
      });
    }
  }

  open(): void {
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    this._isOpen.update((v) => !v);
  }
}
