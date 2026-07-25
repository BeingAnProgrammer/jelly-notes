import { Injectable, signal } from '@angular/core';

export interface Toast {
  readonly id: number;
  readonly message: string;
}

const AUTO_DISMISS_MS = 2200;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toast = signal<Toast | null>(null);
  readonly toast = this._toast.asReadonly();

  private nextId = 0;
  private dismissHandle: ReturnType<typeof setTimeout> | undefined;

  show(message: string): void {
    clearTimeout(this.dismissHandle);
    const id = ++this.nextId;
    this._toast.set({ id, message });
    this.dismissHandle = setTimeout(() => {
      if (this._toast()?.id === id) this._toast.set(null);
    }, AUTO_DISMISS_MS);
  }

  dismiss(): void {
    clearTimeout(this.dismissHandle);
    this._toast.set(null);
  }
}
