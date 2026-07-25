import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { ContentBlock } from '../../models/content-block.model';
import { createEmptyBlock } from './content-block-factory';

interface BlockOption {
  readonly type: ContentBlock['type'];
  readonly label: string;
}

const OPTIONS: BlockOption[] = [
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'heading', label: 'Heading' },
  { type: 'blockquote', label: 'Quote' },
  { type: 'checklist', label: 'Checklist' },
  { type: 'table', label: 'Table' },
  { type: 'code', label: 'Code' },
];

@Component({
  selector: 'app-add-block-menu',
  imports: [ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" appClickOutside (clickOutside)="open.set(false)">
      <button type="button" class="trigger" (click)="open.set(!open())">+ Add block</button>
      @if (open()) {
        <div class="menu" role="menu">
          @for (option of options; track option.type) {
            <button type="button" role="menuitem" (click)="select(option.type)">{{ option.label }}</button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    @use 'mixins' as *;

    .wrap {
      position: relative;
      display: inline-block;
      margin-top: var(--space-8);
    }

    .trigger {
      @include ghost-button;
      padding: var(--space-6) var(--space-14);
      border-style: dashed;
    }

    .menu {
      position: absolute;
      top: calc(100% + var(--space-6));
      left: 0;
      z-index: 30;
      min-width: 160px;
      background: var(--surface);
      border: 1px solid var(--hairline);
      border-radius: var(--radius-lg);
      box-shadow: 0 16px 40px -12px rgb(0 0 0 / 70%);
      padding: var(--space-6);
      animation: m-pop var(--duration-base) var(--ease-standard);

      button {
        display: block;
        width: 100%;
        text-align: left;
        padding: var(--space-8) var(--space-10);
        border: none;
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--ink-2);
        font-family: var(--font-sans);
        font-size: var(--text-13-5);
        cursor: pointer;

        &:hover {
          background: var(--surface-alt);
        }
      }
    }
  `,
})
export class AddBlockMenuComponent {
  readonly add = output<ContentBlock>();
  protected readonly open = signal(false);
  protected readonly options = OPTIONS;

  protected select(type: ContentBlock['type']): void {
    this.add.emit(createEmptyBlock(type));
    this.open.set(false);
  }
}
