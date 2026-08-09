import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AccountSettingsPage } from './account-settings.page';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

describe('AccountSettingsPage', () => {
  let auth: AuthService;
  let toast: ToastService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AccountSettingsPage],
      providers: [provideZonelessChangeDetection()],
    });
    auth = TestBed.inject(AuthService);
    auth.signIn();
    toast = TestBed.inject(ToastService);
  });

  function create() {
    const fixture = TestBed.createComponent(AccountSettingsPage);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('initializes the name control from the current user', () => {
    const page = create();
    expect(page['nameControl'].value).toBe('Jelly User');
  });

  it('saveName updates the profile and shows a toast', () => {
    const page = create();
    page['nameControl'].setValue('Jamie Chen');
    page.saveName();

    expect(auth.currentUser()?.displayName).toBe('Jamie Chen');
    expect(toast.toast()?.message).toBe('Account updated');
  });

  it('saveName does nothing when the control is invalid (blank)', () => {
    const page = create();
    page['nameControl'].setValue('');
    page.saveName();

    expect(auth.currentUser()?.displayName).toBe('Jelly User');
  });

  it('selectAvatar updates the profile avatar and shows a toast', () => {
    const page = create();
    page.selectAvatar('gradient-3');

    expect(auth.currentUser()?.avatar).toBe('gradient-3');
    expect(toast.toast()?.message).toBe('Photo updated');
  });
});
