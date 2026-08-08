import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, UrlTree } from '@angular/router';
import { authGuard, redirectIfSignedInGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard / redirectIfSignedInGuard', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
    auth = TestBed.inject(AuthService);
  });

  it('authGuard blocks navigation and points to /welcome when signed out', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).not.toBe(true);
    expect((result as UrlTree).toString()).toBe('/welcome');
  });

  it('authGuard allows navigation once signed in', () => {
    auth.signIn();
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('redirectIfSignedInGuard allows navigation to /welcome when signed out', () => {
    const result = TestBed.runInInjectionContext(() => redirectIfSignedInGuard({} as never, {} as never));
    expect(result).toBe(true);
  });

  it('redirectIfSignedInGuard bounces an already-signed-in user to /app/dashboard', () => {
    auth.signIn();
    const result = TestBed.runInInjectionContext(() => redirectIfSignedInGuard({} as never, {} as never));
    expect((result as UrlTree).toString()).toBe('/app/dashboard');
  });

  describe('during SSR (no visibility into browser localStorage)', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideRouter([]),
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
    });

    it('authGuard is a no-op so the server renders the route instead of always bouncing to /welcome', () => {
      const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
      expect(result).toBe(true);
    });

    it('redirectIfSignedInGuard is a no-op so /welcome always server-renders', () => {
      const result = TestBed.runInInjectionContext(() => redirectIfSignedInGuard({} as never, {} as never));
      expect(result).toBe(true);
    });
  });
});
