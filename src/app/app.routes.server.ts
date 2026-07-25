import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Note/assignment ids live only in guest-mode localStorage and are unknowable at build time,
  // so these routes render on-demand per request instead of being prerendered.
  { path: 'notes/:id', renderMode: RenderMode.Server },
  { path: 'assignments/:id', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
