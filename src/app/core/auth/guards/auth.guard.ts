import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth state lives only in browser localStorage (guest mode, no session cookie) — the server
 * has no way to know whether a given request is "signed in", so these guards are no-ops during
 * SSR (the shell renders with empty/seed-shaped data either way, per the SSR-without-a-backend
 * tradeoff already accepted for this app) and only actually redirect once hydrated in the
 * browser, where the real localStorage-backed state is available. Without this platform check,
 * a hard reload/deep-link would redirect server-side to /welcome (no visibility into
 * localStorage) and then redirect again client-side back to /dashboard (since the client DOES
 * see the signed-in flag) — silently discarding whatever route was actually requested.
 */
export const authGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isSignedIn() ? true : router.parseUrl('/welcome');
};

export const redirectIfSignedInGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isSignedIn() ? router.parseUrl('/dashboard') : true;
};
