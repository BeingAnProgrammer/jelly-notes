import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ContentBlock } from '../../models/content-block.model';

type CodeBlock = Extract<ContentBlock, { type: 'code' }>;

@Component({
  selector: 'app-code-block',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
})
export class CodeBlockComponent {
  readonly block = input.required<CodeBlock>();
  readonly editable = input(false);
  readonly changed = output<ContentBlock>();
  readonly removed = output<void>();

  protected onLanguageInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.changed.emit({ ...this.block(), language: value || undefined });
  }

  protected onCodeInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.changed.emit({ ...this.block(), code: value });
  }
}
