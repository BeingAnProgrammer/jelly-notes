import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (toastService.toast(); as toast) {
      <div class="toast" role="status" aria-live="polite">
        <app-icon name="check" [size]="15" [strokeWidth]="2" />
        <span>{{ toast.message }}</span>
      </div>
    }
  `,
  styles: `
    @use 'mixins' as *;

    :host {
      position: fixed;
      inset: auto 0 var(--space-28) 0;
      display: flex;
      justify-content: center;
      pointer-events: none;
      z-index: 200;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: var(--space-9);
      padding: var(--space-10) var(--space-16);
      border-radius: var(--radius-lg);
      background: rgb(28 26 21 / 96%);
      backdrop-filter: blur(12px);
      border: 1px solid rgb(59 111 237 / 30%);
      box-shadow: 0 16px 40px -12px rgb(0 0 0 / 70%);
      color: var(--ink);
      font-size: var(--text-13-5);
      animation: m-pop var(--duration-moderate) var(--ease-standard);
    }
  `,
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);
}
