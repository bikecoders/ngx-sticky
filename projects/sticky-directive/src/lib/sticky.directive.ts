import { Directive, OnInit, ElementRef, Input, AfterViewInit } from '@angular/core';

/**
 * This directive puts a css class in a sticky element to improve usability.
 * To understand how it works I highly recommend to read the article that was used to made this.
 * Here you can understand better the architecture:
 * https://developers.google.com/web/updates/2017/09/sticky-headers
 */
@Directive({
  selector: '[ngxSticky]'
})
export class StickyDirective implements OnInit, AfterViewInit {

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

  /**
   * When it's on, add some styles to the sentinel element
   */
  @Input()
  debugMode = false;

  /**
   * Sentinel element created
   */
  private sentinel: HTMLElement;

  constructor(private stickyElement: ElementRef) { }

  ngOnInit(): void {
    this.makeSticky();
  }

  ngAfterViewInit() {
    this.putSentinel();
    this.setObserver();
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

  private setObserver() {
    const observer = new IntersectionObserver(
      this.onAppears.bind(this),
      {
        threshold: [0],
        root: this.scrollContainer as HTMLElement
      });

    // Add the bottom sentinels to each section and attach an observer.
    observer.observe(this.sentinel);
  }

  private onAppears(records: IntersectionObserverEntry[]) {
    console.log('...');

    // for (const record of records) {
    //   const targetInfo = record.boundingClientRect;
    //   const rootBoundsInfo = record.rootBounds;

    //   if (targetInfo.bottom < rootBoundsInfo.top) {
    //     console.log('put');
    //     stickyEl.classList.add('when-sticky');
    //   }

    //   if (targetInfo.bottom >= rootBoundsInfo.top &&
    //     targetInfo.bottom < rootBoundsInfo.bottom) {
    //     console.log('remove');
    //     stickyEl.classList.remove('when-sticky');
    //   }
    // }
  }

  /**
   * Generates the sentinel element with the necessary styles
   */
  private generateSentinelElement(): HTMLElement {
    const sentinelEl = document.createElement('div');
    sentinelEl.style.height = '100px';
    sentinelEl.style.width = '100%';
    sentinelEl.style.position = 'absolute';
    sentinelEl.style.visibility = 'hidden';

    if (this.debugMode) {
      sentinelEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      sentinelEl.style.visibility = 'unset';
    }

    return sentinelEl;
  }

  /**
   * Add the sentinel element as the first child of the triggerOn element
   */
  private putSentinel() {
    const sentinel = this.generateSentinelElement();
    this.sentinel = (this.triggerOn as HTMLElement).insertAdjacentElement('afterbegin', sentinel) as HTMLElement;
  }

}
