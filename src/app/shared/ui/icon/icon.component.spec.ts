import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { IconComponent } from './icon.component';
import { ICONS } from './icon.types';

describe('IconComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconComponent],
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders one SVG child per shape defined for the icon', async () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'search');
    fixture.detectChanges();
    await fixture.whenStable();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.querySelectorAll('circle, path, rect').length).toBe(ICONS.search.length);
  });

  it('applies the size input to both width and height attributes', async () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'home');
    fixture.componentRef.setInput('size', 24);
    fixture.detectChanges();
    await fixture.whenStable();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
  });

  it('is hidden from assistive tech since it is always paired with visible text or a title elsewhere', async () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'star');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-hidden')).toBe('true');
  });
});
