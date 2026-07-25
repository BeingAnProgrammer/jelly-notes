import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly clickOutside = output<void>();

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.clickOutside.emit();
    }
  }
}
