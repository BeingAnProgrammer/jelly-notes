import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ContentBlock } from '../../models/content-block.model';

type HeadingBlock = Extract<ContentBlock, { type: 'heading' }>;

@Component({
  selector: 'app-heading-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (editable()) {
      <div class="shell">
        <input
          class="edit-input"
          type="text"
          placeholder="Heading text…"
          [value]="block().text"
          (input)="onTextInput($event)"
        />
        <button type="button" class="remove" title="Remove heading" (click)="removed.emit()">
          <app-icon name="x" [size]="13" [strokeWidth]="2" />
        </button>
      </div>
    } @else if (block().level === 2) {
      <h2>{{ block().text }}</h2>
    } @else {
      <h3>{{ block().text }}</h3>
    }
  `,
  styles: `
    @use 'mixins' as *;

    .shell {
      @include editable-block-shell;
    }

    .remove {
      @include block-remove-button;
    }

    .edit-input {
      width: 100%;
      border: none;
      background: transparent;
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: var(--text-24);
      font-weight: var(--weight-semibold);
      outline: none;
    }

    h2,
    h3 {
      font-family: var(--font-sans);
      font-weight: var(--weight-semibold);
      color: var(--ink);
      letter-spacing: -0.01em;
      margin: var(--space-30) 0 var(--space-12);
    }

    h2 {
      font-size: var(--text-24);
    }

    h3 {
      font-size: var(--text-18);
    }
  `,
})
export class HeadingBlockComponent {
  readonly block = input.required<HeadingBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();

  protected onTextInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.changed.emit({ ...this.block(), text: value });
  }
}
