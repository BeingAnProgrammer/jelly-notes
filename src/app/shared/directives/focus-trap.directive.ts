import { AfterViewInit, Directive, ElementRef, HostListener, inject } from '@angular/core';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Keeps Tab/Shift+Tab cycling within the host and focuses its first focusable child on init — WCAG 2.4.3 for modals/dialogs. */
@Directive({
  selector: '[appFocusTrap]',
})
export class FocusTrapDirective implements AfterViewInit {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  ngAfterViewInit(): void {
    this.focusableElements()[0]?.focus();
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event): void {
    this.cycle(event, false);
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onShiftTab(event: Event): void {
    this.cycle(event, true);
  }

  private cycle(event: Event, backwards: boolean): void {
    const items = this.focusableElements();
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = this.elementRef.nativeElement.ownerDocument.activeElement;

    if (!backwards && active === last) {
      event.preventDefault();
      first.focus();
    } else if (backwards && active === first) {
      event.preventDefault();
      last.focus();
    }
  }

  private focusableElements(): HTMLElement[] {
    return Array.from(
      this.elementRef.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
  }
}
