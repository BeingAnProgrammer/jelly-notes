import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('exposes the percent as ARIA progressbar attributes for screen readers', async () => {
    const fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.componentRef.setInput('percent', 42);
    fixture.detectChanges();
    await fixture.whenStable();

    const track = fixture.nativeElement.querySelector('[role="progressbar"]');
    expect(track.getAttribute('aria-valuenow')).toBe('42');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
  });

  it('sets the fill width to match the percent', async () => {
    const fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.componentRef.setInput('percent', 75);
    fixture.detectChanges();
    await fixture.whenStable();

    const fill = fixture.nativeElement.querySelector('.fill');
    expect(fill.style.width).toBe('75%');
  });
});
