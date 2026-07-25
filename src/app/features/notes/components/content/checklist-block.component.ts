import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ChecklistItem, ContentBlock } from '../../models/content-block.model';
import { generateId } from '../../../../shared/utils/id';

type ChecklistBlock = Extract<ContentBlock, { type: 'checklist' }>;

export interface ChecklistToggleEvent {
  readonly blockId: string;
  readonly itemId: string;
}

@Component({
  selector: 'app-checklist-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checklist-block.component.html',
  styleUrl: './checklist-block.component.scss',
})
export class ChecklistBlockComponent {
  readonly block = input.required<ChecklistBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();
  readonly toggleItem = output<ChecklistToggleEvent>();

  protected onItemTextInput(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.emitItems(this.block().items.map((item, i) => (i === index ? { ...item, text: value } : item)));
  }

  protected onRemoveItem(index: number): void {
    this.emitItems(this.block().items.filter((_, i) => i !== index));
  }

  protected onAddItem(input: HTMLInputElement): void {
    const text = input.value.trim();
    if (!text) return;
    const item: ChecklistItem = { id: generateId(), text, done: false };
    this.emitItems([...this.block().items, item]);
    input.value = '';
  }

  private emitItems(items: ChecklistItem[]): void {
    this.changed.emit({ ...this.block(), items });
  }
}
