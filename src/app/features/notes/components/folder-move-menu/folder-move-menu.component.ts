import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { FoldersService } from '../../../../core/folders/services/folders.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-folder-move-menu',
  imports: [IconComponent, ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './folder-move-menu.component.html',
  styleUrl: './folder-move-menu.component.scss',
})
export class FolderMoveMenuComponent {
  protected readonly foldersService = inject(FoldersService);
  private readonly notesService = inject(NotesService);

  readonly noteId = input.required<string>();

  protected readonly open = signal(false);

  protected moveTo(folder: string): void {
    this.notesService.moveToFolder(this.noteId(), folder);
    this.open.set(false);
  }
}
