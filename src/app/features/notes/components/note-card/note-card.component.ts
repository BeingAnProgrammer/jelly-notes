import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Note } from '../../models/note.model';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { relativeTime } from '../../../../shared/utils/relative-time';
import { noteColorInk } from '../../models/note-color.model';

@Component({
  selector: 'app-note-card',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
})
export class NoteCardComponent {
  readonly note = input.required<Note>();

  protected readonly relativeTime = relativeTime;
  protected readonly noteColorInk = noteColorInk;
}
