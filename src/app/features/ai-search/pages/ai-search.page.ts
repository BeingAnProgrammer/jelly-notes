import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/ui/empty-state/empty-state.component';
import { AiService } from '../../../core/ai/services/ai.service';
import { AiAnswer } from '../../../core/ai/models/ai-answer.model';
import { SearchResult } from '../../../core/ai/models/search-result.model';
import { NotesService } from '../../notes/services/notes.service';
import { SeoService } from '../../../core/seo/seo.service';
import { relativeTime } from '../../../shared/utils/relative-time';

@Component({
  selector: 'app-ai-search-page',
  imports: [RouterLink, IconComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ai-search.page.html',
  styleUrl: './ai-search.page.scss',
})
export class AiSearchPage {
  private readonly ai = inject(AiService);
  protected readonly notesService = inject(NotesService);
  protected readonly relativeTime = relativeTime;

  readonly q = input('');

  protected readonly query = signal('');
  protected readonly searching = signal(false);
  protected readonly hasSearched = signal(false);
  protected readonly answer = signal<AiAnswer | null>(null);
  protected readonly results = signal<SearchResult[]>([]);

  private hasAutoSearched = false;

  constructor() {
    inject(SeoService).update('AI search', 'Ask questions across every note you’ve written.');

    effect(() => {
      const initial = this.q();
      if (initial && !this.hasAutoSearched) {
        this.hasAutoSearched = true;
        this.query.set(initial);
        this.runSearch(initial);
      }
    });
  }

  protected onQueryInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected submit(): void {
    this.runSearch(this.query());
  }

  protected sourceTitle(noteId: string): string {
    return this.notesService.findById(noteId)?.title ?? 'Note';
  }

  private runSearch(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.searching.set(true);
    this.hasSearched.set(true);

    this.ai.askQuestion(trimmed).subscribe((answer) => {
      this.answer.set(answer);
      this.searching.set(false);
    });
    this.ai.searchNotes(trimmed).subscribe((results) => this.results.set(results));
  }
}
