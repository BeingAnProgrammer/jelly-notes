import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ContentBlock } from '../../models/content-block.model';

type TableBlock = Extract<ContentBlock, { type: 'table' }>;

@Component({
  selector: 'app-table-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-block.component.html',
  styleUrl: './table-block.component.scss',
})
export class TableBlockComponent {
  readonly block = input.required<TableBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();

  protected onHeaderInput(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const headers = this.block().headers.map((h, i) => (i === index ? value : h));
    this.changed.emit({ ...this.block(), headers });
  }

  protected onCellInput(rowIndex: number, colIndex: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const rows = this.block().rows.map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? value : cell)) : row,
    );
    this.changed.emit({ ...this.block(), rows });
  }
}
