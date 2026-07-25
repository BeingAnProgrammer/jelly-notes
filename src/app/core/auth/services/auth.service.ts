import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalStorageService } from '../../persistence/local-storage.service';
import { AppUser } from '../models/user.model';

const USER_KEY = 'auth.user';
const SIGNED_IN_KEY = 'auth.signedIn';

const DEFAULT_USER: AppUser = {
  id: 'guest',
  displayName: 'Alex Rivera',
  role: 'Founder',
  organization: 'Northwind',
  avatar: 'gradient-1',
};

/**
 * Guest-mode auth: no network, no tokens. Sign-in is a local gate matching the design's
 * landing screen. The seam for a real backend is `signIn()` — that's the one place a future
 * implementation would trigger each repository's local-to-cloud migration.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(LocalStorageService);

  private readonly _user = signal<AppUser | null>(this.readInitialUser());
  readonly currentUser = this._user.asReadonly();
  readonly isSignedIn = computed(() => this._user() !== null);

  signIn(): void {
    const user = this.storage.get<AppUser>(USER_KEY) ?? DEFAULT_USER;
    this.storage.set(USER_KEY, user);
    this.storage.set(SIGNED_IN_KEY, true);
    this._user.set(user);
  }

  signOut(): void {
    this.storage.set(SIGNED_IN_KEY, false);
    this._user.set(null);
  }

  updateProfile(changes: Partial<AppUser>): void {
    const current = this._user();
    if (!current) return;
    const updated = { ...current, ...changes };
    this.storage.set(USER_KEY, updated);
    this._user.set(updated);
  }

  private readInitialUser(): AppUser | null {
    const signedIn = this.storage.get<boolean>(SIGNED_IN_KEY);
    if (!signedIn) return null;
    return this.storage.get<AppUser>(USER_KEY) ?? DEFAULT_USER;
  }
}
