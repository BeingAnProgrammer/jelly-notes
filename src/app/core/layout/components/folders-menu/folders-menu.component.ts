import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { FoldersService } from '../../../folders/services/folders.service';

/**
 * Shared dropdown body used both by the top-nav's "All notes" caret and the notes-list page's
 * own folder-label button (both open the identical folder list in v4) — the trigger button stays
 * owned by each consumer since its size/placement differs; this renders only the popover itself,
 * self-positioned directly below whatever it's placed inside (`position: relative` on the host's
 * parent is all a consumer needs to provide).
 */
@Component({
  selector: 'app-folders-menu',
  imports: [ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './folders-menu.component.html',
  styleUrl: './folders-menu.component.scss',
  host: { '(document:keydown.escape)': 'dismiss.emit()' },
})
export class FoldersMenuComponent {
  protected readonly foldersService = inject(FoldersService);

  readonly activeFolder = input<string | null>(null);
  readonly select = output<string>();
  readonly clear = output<void>();
  readonly newFolder = output<void>();
  readonly dismiss = output<void>();
}
