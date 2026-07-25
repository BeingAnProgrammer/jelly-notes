import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ContentBlock } from '../../models/content-block.model';

type ParagraphBlock = Extract<ContentBlock, { type: 'paragraph' }>;

@Component({
  selector: 'app-paragraph-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (editable()) {
      <div class="shell">
        <textarea
          class="edit-input"
          rows="2"
          placeholder="Paragraph text…"
          [value]="plainText()"
          (input)="onInput($event)"
        ></textarea>
        <button type="button" class="remove" title="Remove paragraph" (click)="removed.emit()">
          <app-icon name="x" [size]="13" [strokeWidth]="2" />
        </button>
      </div>
    } @else {
      <p class="paragraph">
        @for (run of block().runs; track $index) {
          @if (run.link) {
            <a [href]="run.link" class="run-link">{{ run.text }}</a>
          } @else if (run.bold) {
            <strong>{{ run.text }}</strong>
          } @else if (run.emphasis) {
            <em class="run-emphasis">{{ run.text }}</em>
          } @else {
            <span>{{ run.text }}</span>
          }
        }
      </p>
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
      font-family: var(--font-sans);
      font-size: var(--text-16);
      line-height: 1.7;
      resize: vertical;
      outline: none;
    }

    .paragraph {
      margin: 0 0 var(--space-18);
    }

    .run-emphasis {
      font-family: var(--font-display);
      font-style: italic;
      color: var(--ink);
      font-size: 1.05em;
    }

    .run-link {
      color: var(--accent);
      border-bottom: 1px solid rgb(124 135 255 / 40%);
    }
  `,
})
export class ParagraphBlockComponent {
  readonly block = input.required<ParagraphBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();

  protected readonly plainText = computed(() => this.block().runs.map((r) => r.text).join(''));

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.changed.emit({ ...this.block(), runs: [{ text: value }] });
  }
}
