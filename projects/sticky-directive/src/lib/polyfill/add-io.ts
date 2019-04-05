/**
   * Indicates if Intersection Observer exits
   *
   * @returns true if Intersection Observer is implemented
   */
export function IOExits() {
  return 'IntersectionObserver' in window;
}

(function () {
  // If doesn't exits, import the polyfill
  if (IOExits()) {
    require('intersection-observer');
    // console.log('Import that shit');
  }
})();
