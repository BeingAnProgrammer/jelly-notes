import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { NotesService } from '../../services/notes.service';
import { NOTE_COLORS } from '../../models/note-color.model';

@Component({
  selector: 'app-note-color-menu',
  imports: [ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-color-menu.component.html',
  styleUrl: './note-color-menu.component.scss',
})
export class NoteColorMenuComponent {
  private readonly notesService = inject(NotesService);

  readonly noteId = input.required<string>();
  readonly dot = input.required<string>();

  protected readonly colors = NOTE_COLORS;
  protected readonly open = signal(false);

  protected pick(dot: string): void {
    this.notesService.update(this.noteId(), { dot });
    this.open.set(false);
  }
}
