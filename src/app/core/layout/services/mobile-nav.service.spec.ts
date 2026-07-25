import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MobileNavService } from './mobile-nav.service';

@Component({ selector: 'app-blank', template: '' })
class BlankComponent {}

describe('MobileNavService', () => {
  let service: MobileNavService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([{ path: 'other', component: BlankComponent }]),
      ],
    });
    service = TestBed.inject(MobileNavService);
    router = TestBed.inject(Router);
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

  it('closes automatically on navigation', async () => {
    service.open();
    await router.navigate(['/other']);
    expect(service.isOpen()).toBe(false);
  });
});
