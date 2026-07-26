import { RenderMode, ServerRoute } from '@angular/ssr';

// Every route in this app is gated by client-only auth (guest-mode sign-in lives solely in
// browser localStorage — there's no server session to consult) and/or reads client-only
// localStorage data (notes, assignments). Prerendering or SSR-ing any of it means the server
// has to guess the auth state, and both guards already allow everything through during SSR
// for exactly that reason. The result was a real bug: `/` prerendered to a static meta-refresh
// to `/dashboard`, and `/dashboard` itself was fully prerendered with seed data — so a
// signed-out visitor's first paint was the dashboard, which then flashed to `/welcome` once
// the client-side guard re-ran after hydration and found no one signed in. Rendering
// everything client-side means the real guard decision happens once, before anything paints.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Client }];
