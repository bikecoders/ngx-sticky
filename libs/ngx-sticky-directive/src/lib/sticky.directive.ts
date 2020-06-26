import {
  Directive,
  OnInit,
  ElementRef,
  Input,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * This directive puts a css class in a sticky element to improve usability.
 * To understand how it works I highly recommend to read the article that was used to made this.
 * Here you can understand better the architecture:
 * https://developers.google.com/web/updates/2017/09/sticky-headers
 */
/** @dynamic */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngxSticky]',
})
export class StickyDirective implements OnInit, AfterViewInit {
  /**
   * * It must be a top container of the sticky element and of the element that will trigger the custom class on the sticky element.
   * * This should be the element with the scroll
   * If an string is provided, it must be the ID of the element.
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
   * When the sticky element bypass this element the custom class will apply.
   * If an string is provided, it must be the ID of the element.
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
  public get debugMode() {
    return this._debugMode;
  }
  public set debugMode(value) {
    this._debugMode = value;

    if (this._debugMode && !!this.sentinel) {
      this.sentinel.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      this.sentinel.style.visibility = 'unset';
    } else if (!this._debugMode && !!this.sentinel) {
      this.sentinel.style.visibility = 'hidden';
    }
  }
  private _debugMode = false;

  /**
   * Class to be added to the target element when becomes sticky
   */
  @Input()
  classWhenSticky = '';

  /**
   * zIndex value to set to the target element
   */
  @Input()
  zIndex = 10;

  /**
   * Top value to set to the target element
   */
  @Input()
  top = 0;

  /**
   * Sentinel element created
   */
  private sentinel: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private stickyElement: ElementRef
  ) {}

  ngOnInit(): void {
    this.makeSticky();
  }

  ngAfterViewInit() {
    this.putSentinel();
    if (
      isPlatformBrowser(this.platformId) &&
      this.intersectionObserverExists()
    ) {
      this.setObserver();
    }
  }

  private intersectionObserverExists() {
    return 'IntersectionObserver' in window;
  }

  /**
   * Transform if needed into HTMLElement a value given to be set in a property
   */
  private setHTMLElement(
    prop: string,
    value: string | ElementRef | HTMLElement
  ): void {
    if (typeof value === 'string') {
      this[prop] = this.document.getElementById(value);
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
  private makeSticky() {
    const nativeElement: HTMLElement = this.stickyElement.nativeElement;

    this.setStylePropertyToElement(nativeElement, 'position', '-webkit-sticky');
    this.setStylePropertyToElement(nativeElement, 'position', 'sticky');
    this.setStylePropertyToElement(nativeElement, 'top', `${this.top}px`);
    this.setStylePropertyToElement(
      nativeElement,
      'zIndex',
      this.zIndex.toString()
    );
  }

  private setStylePropertyToElement(
    nativeEl: HTMLElement,
    property: keyof CSSStyleDeclaration,
    value: string
  ) {
    nativeEl.style[property.toString()] = value;
  }

  /**
   * Start listening to the scroll event on the container element
   */
  private setObserver() {
    const observer = new IntersectionObserver(
      records => this.onAppears(records),
      {
        threshold: [0],
        root: this.scrollContainer as HTMLElement,
      }
    );

    // Add the bottom sentinels to each section and attach an observer.
    observer.observe(this.sentinel);
  }

  /**
   * Add/Remove class to the target element when the sentinel element disappear/appear
   */
  private onAppears(records: IntersectionObserverEntry[]) {
    for (const record of records) {
      const nativeElement: HTMLElement = this.stickyElement.nativeElement;
      const targetInfo = record.boundingClientRect;
      const rootBoundsInfo = record.rootBounds;

      if (targetInfo.bottom < rootBoundsInfo.top) {
        nativeElement.classList.add(this.classWhenSticky);
      }

      if (
        targetInfo.bottom >= rootBoundsInfo.top &&
        targetInfo.bottom < rootBoundsInfo.bottom
      ) {
        nativeElement.classList.remove(this.classWhenSticky);
      }
    }
  }

  /**
   * Generates the sentinel element with the necessary styles
   */
  private generateSentinelElement(): HTMLElement {
    const sentinelEl = this.document.createElement('div');
    sentinelEl.style.height = '50px';
    sentinelEl.style.width = '100%';
    sentinelEl.style.position = 'absolute';
    sentinelEl.style.visibility = 'hidden';

    if (this._debugMode) {
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
    this.sentinel = (this.triggerOn as HTMLElement).insertAdjacentElement(
      'afterbegin',
      sentinel
    ) as HTMLElement;
  }
}
