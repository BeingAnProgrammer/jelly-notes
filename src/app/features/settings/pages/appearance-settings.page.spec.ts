import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppearanceSettingsPage } from './appearance-settings.page';
import { AppearanceService } from '../../../core/appearance/services/appearance.service';
import { ToastService } from '../../../core/services/toast.service';

describe('AppearanceSettingsPage', () => {
  let appearance: AppearanceService;
  let toast: ToastService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [AppearanceSettingsPage],
      providers: [provideZonelessChangeDetection()],
    });
    appearance = TestBed.inject(AppearanceService);
    toast = TestBed.inject(ToastService);
  });

  function create() {
    const fixture = TestBed.createComponent(AppearanceSettingsPage);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('setTheme("light") updates the appearance service and shows a matching toast', () => {
    const page = create();
    page.setTheme('light');

    expect(appearance.theme()).toBe('light');
    expect(toast.toast()?.message).toBe('Light theme on');
  });

  it('setTheme("dark") updates the appearance service and shows a matching toast', () => {
    const page = create();
    page.setTheme('dark');

    expect(appearance.theme()).toBe('dark');
    expect(toast.toast()?.message).toBe('Dark theme on');
  });
});
