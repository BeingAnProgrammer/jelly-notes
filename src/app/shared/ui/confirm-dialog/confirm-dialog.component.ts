import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal [ariaLabel]="title()" [width]="380" (dismissed)="cancelled.emit()">
      <div class="body">
        <h2>{{ title() }}</h2>
        <p>{{ message() }}</p>
        <div class="footer">
          <button type="button" class="btn-ghost" (click)="cancelled.emit()">{{ cancelLabel() }}</button>
          <button type="button" class="btn-danger" (click)="confirmed.emit()">{{ confirmLabel() }}</button>
        </div>
      </div>
    </app-modal>
  `,
  styles: `
    @use 'mixins' as *;

    .body {
      padding: var(--space-24);
    }

    h2 {
      margin: 0 0 var(--space-10);
      font-family: var(--font-display);
      font-size: var(--text-22);
      font-weight: 400;
      color: var(--ink);
    }

    p {
      margin: 0 0 var(--space-20);
      font-size: var(--text-14);
      color: var(--ink-3);
      line-height: 1.5;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-8);
    }

    .btn-ghost {
      @include ghost-button;
      padding: var(--space-8) var(--space-14);
    }

    .btn-danger {
      @include primary-button;
      padding: var(--space-8) var(--space-14);
      background: var(--warm);

      &:hover {
        background: var(--warm);
        opacity: 0.9;
      }
    }
  `,
})
export class ConfirmDialogComponent {
  readonly title = input('Are you sure?');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
