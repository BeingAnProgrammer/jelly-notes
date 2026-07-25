import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CommandPaletteService } from './command-palette.service';

describe('CommandPaletteService', () => {
  let service: CommandPaletteService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(CommandPaletteService);
  });

  it('starts closed', () => {
    expect(service.isOpen()).toBe(false);
  });

  it('open/close/toggle control visibility', () => {
    service.open();
    expect(service.isOpen()).toBe(true);
    service.close();
    expect(service.isOpen()).toBe(false);
    service.toggle();
    expect(service.isOpen()).toBe(true);
  });

  it('Cmd/Ctrl+K toggles the palette open and closed', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    expect(service.isOpen()).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(service.isOpen()).toBe(false);
  });

  it('Escape closes the palette only while it is open', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(service.isOpen()).toBe(false);

    service.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(service.isOpen()).toBe(false);
  });
});
