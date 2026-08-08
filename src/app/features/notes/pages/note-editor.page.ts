import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { PillComponent } from '../../../shared/ui/pill/pill.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { FolderMoveMenuComponent } from '../components/folder-move-menu/folder-move-menu.component';
import { NoteContentRendererComponent } from '../components/content/note-content-renderer.component';
import { AddBlockMenuComponent } from '../components/content/add-block-menu.component';
import { ChecklistToggleEvent } from '../components/content/checklist-block.component';
import { NotesService } from '../services/notes.service';
import { ContentBlock } from '../models/content-block.model';
import { relativeTime } from '../../../shared/utils/relative-time';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-note-editor-page',
  imports: [
    IconComponent,
    PillComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    FolderMoveMenuComponent,
    NoteContentRendererComponent,
    AddBlockMenuComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './note-editor.page.html',
  styleUrl: './note-editor.page.scss',
})
export class NoteEditorPage {
  protected readonly notesService = inject(NotesService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  readonly id = input.required<string>();

  protected readonly note = computed(() => this.notesService.findById(this.id()));
  protected readonly relativeTime = relativeTime;

  protected readonly editing = signal(false);
  protected readonly focusMode = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly addingTag = signal(false);

  protected readonly draftTitle = signal('');
  protected readonly draftContent = signal<ContentBlock[]>([]);

  protected readonly editorWidth = computed(() => (this.focusMode() ? 720 : 760));
  protected readonly editorPad = computed(() =>
    this.focusMode() ? '64px 40px 120px' : '32px 40px 100px',
  );

  constructor() {
    effect(() => {
      const note = this.note();
      this.seo.update(note?.title ?? 'Note', note?.excerpt || 'A note in Jelly Notes.');
    });
  }

  startEdit(): void {
    const note = this.note();
    if (!note) return;
    this.draftTitle.set(note.title);
    this.draftContent.set(note.content);
    this.editing.set(true);
  }

  saveNote(): void {
    const note = this.note();
    if (!note) return;
    this.notesService.update(note.id, { title: this.draftTitle(), content: this.draftContent() });
    this.editing.set(false);
  }

  onTitleInput(event: Event): void {
    this.draftTitle.set((event.target as HTMLInputElement).value);
  }

  onToggleItem(event: ChecklistToggleEvent): void {
    if (this.editing()) {
      this.draftContent.update((blocks) =>
        blocks.map((block) => {
          if (block.id !== event.blockId || block.type !== 'checklist') return block;
          return {
            ...block,
            items: block.items.map((item) =>
              item.id === event.itemId ? { ...item, done: !item.done } : item,
            ),
          };
        }),
      );
    } else {
      this.notesService.toggleChecklistItem(this.id(), event.blockId, event.itemId);
    }
  }

  toggleFavorite(): void {
    this.notesService.toggleFavorite(this.id());
  }

  toggleArchive(): void {
    const note = this.note();
    if (!note) return;
    if (note.archived) this.notesService.unarchive(note.id);
    else this.notesService.archive(note.id);
  }

  toggleFocusMode(): void {
    this.focusMode.update((v) => !v);
  }

  confirmDelete(): void {
    this.notesService.remove(this.id());
    this.showDeleteConfirm.set(false);
    this.router.navigate(['/app/notes']);
  }

  protected deleteMessage(title: string): string {
    return `"${title}" will be permanently deleted. This can't be undone.`;
  }

  addTag(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value) this.notesService.addTag(this.id(), value);
    input.value = '';
    this.addingTag.set(false);
  }
}
