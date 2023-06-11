import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[validNumber]'
})
export class ValidNumberDirective {
  allowedKeyCodes = new Set([35, 36, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 189, 190]);

  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeydown(event: { keyCode: number; preventDefault: () => void; }) {
    const initalValue = this._el.nativeElement.value;
    if (initalValue.split('.').length == 2 && event.keyCode == 190) {
      event.preventDefault();
    }
    else if (initalValue.split('-').length == 2 && event.keyCode == 189) {
      event.preventDefault();
    }
    else if (event.keyCode > 31 && !this.allowedKeyCodes.has(event.keyCode)) {
      event.preventDefault();
    }
    this._el.nativeElement.value = initalValue.length > 0 ? initalValue.replace(/,/g, '') : initalValue;
  }
}
