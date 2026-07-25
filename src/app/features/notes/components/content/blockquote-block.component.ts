import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ContentBlock } from '../../models/content-block.model';

type BlockquoteBlock = Extract<ContentBlock, { type: 'blockquote' }>;

@Component({
  selector: 'app-blockquote-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (editable()) {
      <div class="shell">
        <textarea
          class="edit-input"
          rows="2"
          placeholder="Quote text…"
          [value]="block().text"
          (input)="onInput($event)"
        ></textarea>
        <button type="button" class="remove" title="Remove quote" (click)="removed.emit()">
          <app-icon name="x" [size]="13" [strokeWidth]="2" />
        </button>
      </div>
    } @else {
      <blockquote>{{ block().text }}</blockquote>
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
      color: var(--ink-2);
      font-family: var(--font-display);
      font-style: italic;
      font-size: var(--text-20);
      resize: vertical;
      outline: none;
    }

    blockquote {
      margin: 0 0 var(--space-18);
      padding: var(--space-4) 0 var(--space-4) var(--space-18);
      border-left: 2px solid var(--accent);
      color: var(--ink-2);
      font-family: var(--font-display);
      font-size: var(--text-20);
      font-style: italic;
      line-height: 1.5;
    }
  `,
})
export class BlockquoteBlockComponent {
  readonly block = input.required<BlockquoteBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.changed.emit({ ...this.block(), text: value });
  }
}
