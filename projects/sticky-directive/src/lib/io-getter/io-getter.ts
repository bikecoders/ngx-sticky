const IOPolyfill = require('intersection-observer');

/**
 * Function to get the intersection observer
 *
 * In older browsers the intersection observer may be no present.
 * With this method we can get the native one or a polifyll
 */
export class IOGetter {
  readonly needIntersectionObserverPolyfill: boolean;

  private window: Window;

  get IntersectionObserver() {
    return this._IntersectionObserver;
  }
  private _IntersectionObserver: IntersectionObserver;

  constructor() {
    this.window = this.getWindow();

    this.needIntersectionObserverPolyfill = !this.isIntersectionObserverAvailable();
    this._IntersectionObserver = this.getIntersectionObserver();
  }

  private getIntersectionObserver(): IntersectionObserver {
    if (this.needIntersectionObserverPolyfill) {
      return IOPolyfill;
    } else {
      return IntersectionObserver as any;
    }
  }

  private isIntersectionObserverAvailable() {
    return 'IntersectionObserver' in this.window;
  }

  private getWindow() {
    return window;
  }
}
