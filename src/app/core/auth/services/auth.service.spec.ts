import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthService } from './auth.service';

function freshAuthService(): AuthService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  return TestBed.inject(AuthService);
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(AuthService);
  });

  it('starts signed out when no session was ever persisted', () => {
    expect(service.isSignedIn()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('signIn() signs a default guest user in', () => {
    service.signIn();
    expect(service.isSignedIn()).toBe(true);
    expect(service.currentUser()?.displayName).toBe('Alex Rivera');
  });

  it('signOut() clears the session but the profile itself survives for the next sign-in', () => {
    service.signIn();
    service.updateProfile({ displayName: 'Jamie Chen' });
    service.signOut();
    expect(service.isSignedIn()).toBe(false);

    const rehydrated = freshAuthService();
    rehydrated.signIn();
    expect(rehydrated.currentUser()?.displayName).toBe('Jamie Chen');
  });

  it('a fresh AuthService instance restores an already-signed-in session from storage', () => {
    service.signIn();
    expect(freshAuthService().isSignedIn()).toBe(true);
  });
});
