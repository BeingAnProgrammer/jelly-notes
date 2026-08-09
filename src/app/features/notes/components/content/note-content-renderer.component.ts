import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ContentBlock } from '../../models/content-block.model';
import { ParagraphBlockComponent } from './paragraph-block.component';
import { HeadingBlockComponent } from './heading-block.component';
import { BlockquoteBlockComponent } from './blockquote-block.component';
import { ChecklistBlockComponent, ChecklistToggleEvent } from './checklist-block.component';
import { TableBlockComponent } from './table-block.component';
import { CodeBlockComponent } from './code-block.component';

@Component({
  selector: 'app-note-content-renderer',
  imports: [
    ParagraphBlockComponent,
    HeadingBlockComponent,
    BlockquoteBlockComponent,
    ChecklistBlockComponent,
    TableBlockComponent,
    CodeBlockComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (block of blocks(); track block.id; let i = $index) {
      @switch (block.type) {
        @case ('paragraph') {
          <app-paragraph-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
          />
        }
        @case ('heading') {
          <app-heading-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
          />
        }
        @case ('blockquote') {
          <app-blockquote-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
          />
        }
        @case ('checklist') {
          <app-checklist-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
            (toggleItem)="toggleItem.emit($event)"
          />
        }
        @case ('table') {
          <app-table-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
          />
        }
        @case ('code') {
          <app-code-block
            [block]="block"
            [editable]="editable()"
            (changed)="onChanged(i, $event)"
            (removed)="onRemoved(i)"
          />
        }
      }
    }
  `,
})
export class NoteContentRendererComponent {
  readonly blocks = input.required<ContentBlock[]>();
  readonly editable = input(false);
  readonly blocksChange = output<ContentBlock[]>();
  readonly toggleItem = output<ChecklistToggleEvent>();

  protected onChanged(index: number, updated: ContentBlock): void {
    const next = this.blocks().map((b, i) => (i === index ? updated : b));
    this.blocksChange.emit(next);
  }

  protected onRemoved(index: number): void {
    this.blocksChange.emit(this.blocks().filter((_, i) => i !== index));
  }
}
