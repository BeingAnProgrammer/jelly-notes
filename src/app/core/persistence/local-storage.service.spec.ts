import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(LocalStorageService);
  });

  it('returns null for a key that was never set', () => {
    expect(service.get('missing')).toBeNull();
  });

  it('round-trips an object through set/get', () => {
    service.set('notes', [{ id: 'n1' }]);
    expect(service.get<{ id: string }[]>('notes')).toEqual([{ id: 'n1' }]);
  });

  it('namespaces keys so they do not collide with unrelated localStorage entries', () => {
    service.set('theme', 'dark');
    expect(localStorage.getItem('jelly-notes.theme')).toBe('"dark"');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('removes a key', () => {
    service.set('theme', 'dark');
    service.remove('theme');
    expect(service.get('theme')).toBeNull();
  });

  it('treats invalid JSON already in storage as absent rather than throwing', () => {
    localStorage.setItem('jelly-notes.corrupt', 'not json{');
    expect(service.get('corrupt')).toBeNull();
  });
});
