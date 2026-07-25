import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { FocusTrapDirective } from '../../directives/focus-trap.directive';

@Component({
  selector: 'app-modal',
  imports: [ClickOutsideDirective, FocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scrim">
      <div
        class="card"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="ariaLabel() || null"
        [style.width.px]="width()"
        appClickOutside
        (clickOutside)="dismissed.emit()"
        appFocusTrap
        (keydown.escape)="dismissed.emit()"
      >
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    @use 'mixins' as *;

    .scrim {
      @include modal-scrim;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .card {
      @include modal-card;
    }
  `,
})
export class ModalComponent {
  readonly ariaLabel = input('');
  readonly width = input(420);
  readonly dismissed = output<void>();
}
