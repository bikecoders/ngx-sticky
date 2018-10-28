import { Directive, OnInit, ElementRef, Input } from '@angular/core';

/**
 * This directive puts a css class in a sticky element to improve usability.
 * To understand how it works I highly recommend to read the article that was used to made this.
 * Here you can understand better the architecture:
 * https://developers.google.com/web/updates/2017/09/sticky-headers
 */
@Directive({
  selector: '[ngxSticky]'
})
export class StickyDirective implements OnInit {

  /**
   * * It must be a top container of the sticky element and of the element that will trigger the custom class on the sticky element.
   * * This should be the element with the scroll
   */
  @Input()
  get scrollContainer(): string | ElementRef | HTMLElement {
    return this._scrollContainer;
  }
  set scrollContainer(value: string | ElementRef | HTMLElement) {
    this.setHTMLElement('_scrollContainer', value);
  }
  private _scrollContainer: HTMLElement;

  /**
   * Element that will trigger the custom class on the sticky element.
   */
  @Input()
  get triggerOn(): string | ElementRef | HTMLElement {
    return this._triggerOn;
  }
  set triggerOn(value: string | ElementRef | HTMLElement) {
    this.setHTMLElement('_triggerOn', value);
  }
  private _triggerOn: HTMLElement;

  constructor(private stickyElement: ElementRef) { }

  ngOnInit(): void {
    this.makeSticky();
  }

  /**
   * Transform if needed into HTMLElement a value given to be set in a property
   */
  private setHTMLElement(prop: string, value: string | ElementRef | HTMLElement): void {
    if (typeof value === 'string') {
      this[prop] = document.getElementById(value);
    } else if (value instanceof ElementRef) {
      this[prop] = value.nativeElement;
    } else {
      this[prop] = value;
    }
  }

  /**
   * Make the main element sticky.
   * Put the necessary css to make it happen.
   */
  private makeSticky(): void {
    const nativeElement: HTMLElement = this.stickyElement.nativeElement;
    nativeElement.style.position = 'sticky';
    nativeElement.style.top = '0'; // TODO: input
    nativeElement.style.zIndex = '10'; // TODO: input
  }

}
