import { ErrorHandler, Injectable } from '@angular/core';

/**
 * There's no remote error-reporting backend in this build (local-only phase — see AuthService).
 * This still matters: without it, an error thrown outside a template/event context (e.g. inside
 * an effect or a subscribe callback) fails silently in production builds. Logging clearly here
 * is the seam where a real telemetry sink (Sentry, etc.) plugs in later.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[Jelly Notes] Unhandled error:', error);
  }
}
