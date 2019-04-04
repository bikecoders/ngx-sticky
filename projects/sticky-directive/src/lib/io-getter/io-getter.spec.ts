import { IOGetter } from './io-getter';
const IOPolyfill = require('intersection-observer');

describe('IntersectionObserverGetter', () => {
  let iOGetter: IOGetter;

  beforeEach(() => {
    iOGetter = new IOGetter();
  });

  it('should create an instance', () => {
    expect(iOGetter).toBeTruthy();
  });

  describe('Get Intersection Observer', () => {
    it('should get the native intersection observer', () => {
      spyOn(IOGetter.prototype as any, 'getWindow').and.returnValue({ 'IntersectionObserver': {} });

      const instance: IOGetter = new IOGetter();

      expect(instance.IntersectionObserver).toBe(IntersectionObserver as any);
    });

    it('should get the polyfill version of intersection observer', () => {
      spyOn(IOGetter.prototype as any, 'getWindow').and.returnValue({ 'nothing': {} } as any);

      const instance: IOGetter = new IOGetter();

      expect(instance.IntersectionObserver).toEqual(IOPolyfill);
    });
  });
});
