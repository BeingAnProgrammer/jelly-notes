import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_NAME = 'Jelly Notes';

/** Thin wrapper over Angular's Title/Meta services so every page sets title + description + OG tags consistently. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /**
   * `private: true` keeps the real title in the browser tab (useful, and not what a link-
   * preview unfurl reads) but writes a generic meta description/OG title/OG description
   * instead of the real one. This app is SSR'd, so those tags render straight into the raw
   * HTML response — for an authenticated page showing a specific note or assignment, the
   * real title+excerpt would otherwise be exposed to whoever generates a link preview
   * (Slack, iMessage, etc.) for that URL, with no auth check in between.
   */
  update(pageTitle: string, description: string, options?: { private?: boolean }): void {
    const fullTitle = `${pageTitle} · ${SITE_NAME}`;
    this.title.setTitle(fullTitle);
    if (options?.private) {
      this.meta.updateTag({ name: 'description', content: `Sign in to Jelly Notes to view this.` });
      this.meta.updateTag({ property: 'og:title', content: SITE_NAME });
      this.meta.updateTag({
        property: 'og:description',
        content: 'A private workspace in Jelly Notes.',
      });
      this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
      return;
    }
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
  }
}
