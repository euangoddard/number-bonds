import { AfterViewInit, Directive, ElementRef, Input, NgZone } from '@angular/core';

@Directive({
  selector: '[nbAutoFocus]',
})
export class AutoFocusDirective implements AfterViewInit {
  @Input('nbAutoFocus') shouldFocus: boolean;

  private readonly inputElement: HTMLInputElement;

  constructor(private readonly zone: NgZone, elementRef: ElementRef<HTMLInputElement>) {
    this.inputElement = elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.refocus();
  }

  refocus(): void {
    if (this.shouldFocus) {
      setTimeout(() => {
        this.inputElement.focus();
      }, 50);
    }
  }
}
