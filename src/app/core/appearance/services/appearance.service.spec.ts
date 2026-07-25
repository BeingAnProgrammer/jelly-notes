import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppearanceService } from './appearance.service';

describe('AppearanceService', () => {
  let service: AppearanceService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(AppearanceService);
  });

  it('defaults to dark when nothing was persisted', () => {
    expect(service.theme()).toBe('dark');
  });

  it('applies the theme to <html data-theme> as a side effect', () => {
    TestBed.tick();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme updates the signal, the DOM attribute, and persists the choice', () => {
    service.setTheme('light');
    TestBed.tick();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('memora.theme')).toBe('"light"');
  });

  it('toggleTheme flips between dark and light', () => {
    service.toggleTheme();
    expect(service.theme()).toBe('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
  });

  it('a fresh instance restores the persisted theme', () => {
    service.setTheme('light');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    expect(TestBed.inject(AppearanceService).theme()).toBe('light');
  });
});
