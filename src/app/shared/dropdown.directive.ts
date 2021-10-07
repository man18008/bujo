import { Directive, HostListener, HostBinding } from '@angular/core';


@Directive({
  selector: '[cmsDropdown]',
  exportAs: 'cmsDropdown'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  @HostListener('click') toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }
  constructor() { }

}