import { By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject, of } from 'rxjs';
import { tap, concatMap, take } from 'rxjs/operators';

import { StickyDirective } from './sticky.directive';

@Component({
  selector: 'ngx-dummy-component',
  styles: [`
    #body-container {
      background-color: yellow;
      height: 2000px;
      overflow: scroll;
      padding: 10px;
    }

    .super-height {
      background-color: black;
      height: 5000px;
      position: relative;
      width: 100%;
    }

    #sticky-component {
      background-color: green;
      height: 50px;
      width: 100%;
      top: -10px;
      z-index: 10;
    }

    .when-sticky {
      background-color: magenta !important;
    }
  `],
  template: `
    <div id="body-container" #scCont>
      <div
        id="sticky-component"
        ngxSticky
        [scrollContainer]="scCont"
        [triggerOn]="'trigger-here'"
        [debugMode]="true"
        [classWhenSticky]="'when-sticky'"
      >
      </div>
      <div id="trigger-here" class="super-height">
      </div>
    </div>
  `,
})
class DummyComponent {
  @ViewChild('scCont') scCont: ElementRef;
}

describe('StickyDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let componentDe: DebugElement;

  let directiveDe: DebugElement;
  let directive: StickyDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DummyComponent,
        StickyDirective
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    componentDe = fixture.debugElement;

    directiveDe = componentDe.query(By.directive(StickyDirective));
    directive = directiveDe.injector.get(StickyDirective);

    fixture.detectChanges();
  });

  it('should create a Sticky directive instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('Add css properties to sticky element', () => {

    it('should set style property correctly', () => {
      const fn = (directive as any).setStylePropertyToElement;
      const el = {
        style: {}
      } as HTMLElement;
      const property = 'zIndex';
      const value = '1000';

      fn(el, property, value);

      expect(el.style.zIndex).toEqual(value);
    });

    describe('Properties', () => {
      let setPropertySpy: jasmine.Spy;
      let nativeEl: HTMLElement;

      beforeEach(() => {
        setPropertySpy = spyOn(directive as any, 'setStylePropertyToElement');
        (directive as any).makeSticky();
        nativeEl = (directive as any).stickyElement.nativeElement;
      });

      it('should add sticky', () => {
        expect(setPropertySpy).toHaveBeenCalledWith(nativeEl, 'position', 'sticky');
        expect(setPropertySpy).toHaveBeenCalledWith(nativeEl, 'position', '-webkit-sticky');
      });

      it('should add top', () => {
        expect(setPropertySpy).toHaveBeenCalledWith(nativeEl, 'top', '0px');
      });

      it('should add zIndex', () => {
        expect(setPropertySpy).toHaveBeenCalledWith(nativeEl, 'zIndex', '10');
      });
    });
  });

  describe('Elements Setter', () => {

    describe('setHTMLElement', () => {
      it('should transform from string', () => {
        directive.scrollContainer = 'body-container';

        const scrollContainer = document.getElementById('body-container');
        expect(directive.scrollContainer).toBe(scrollContainer as any);
      });

      it('should transform from ElementRef', () => {
        directive.scrollContainer = component.scCont;

        const scrollContainer: HTMLElement = component.scCont.nativeElement;
        expect(directive.scrollContainer).toBe(scrollContainer as any);
      });

      it('should set the HTMLElement received', () => {
        const scrollContainer = document.getElementById('body-container');
        expect(directive.scrollContainer).toBe(scrollContainer as any);
      });
    });

    describe('Setters', () => {
      let setHTMLElementSpy: jasmine.Spy;

      beforeEach(() => {
        setHTMLElementSpy = spyOn(directive as any, 'setHTMLElement');
      });

      it('should the setter of scrollContainer call the setHTMLElement correctly', () => {
        directive.scrollContainer = 'body-container';
        expect(setHTMLElementSpy).toHaveBeenCalledWith('_scrollContainer', 'body-container');
      });

      it('should the setter of triggerOn call the setHTMLElement correctly', () => {
        directive.triggerOn = 'trigger-here';
        expect(setHTMLElementSpy).toHaveBeenCalledWith('_triggerOn', 'trigger-here');
      });

      it('should set debug mode correctly', () => {
        directive.debugMode = true;
        expect(directive.debugMode).toBeTruthy();

        directive.debugMode = false;
        expect(directive.debugMode).toBeFalsy();
      });
    });

  });

  describe('Put Sentinel', () => {
    it('should add sentinel right after the triggerOn element', () => {
      const sentinel = getSentinelElementFromDom();
      expect(sentinel).toEqual((directive as any).sentinel);
      expect(sentinel.style.position).toBe('absolute');
    });

    describe('Debug Mode', () => {
      it('should, on debug mode, put styles on the sentinel', () => {
        directive.debugMode = true;
        const sentinel = (directive as any).generateSentinelElement();
        expect(sentinel.style.backgroundColor).toBeTruthy();
        expect(sentinel.style.visibility).toEqual('unset');
      });

      it('should, NOT on debug mode, put styles on the sentinel', () => {
        directive.debugMode = false;
        const sentinel = (directive as any).generateSentinelElement();
        expect(sentinel.style.backgroundColor).toEqual('');
        expect(sentinel.style.visibility).toEqual('hidden');
      });

      it('should update styles on sentinel based on debug mode', () => {
        // Show Sentinel
        directive.debugMode = true;
        let sentinel = getSentinelElementFromDom();

        expect(sentinel.style.visibility).toEqual('unset');
        expect(sentinel.style.backgroundColor).toEqual('rgba(255, 0, 0, 0.5)');

        // Hide Sentinel
        directive.debugMode = false;
        sentinel = getSentinelElementFromDom();

        expect(sentinel.style.visibility).toEqual('hidden');
      });
    });

    function getSentinelElementFromDom(): HTMLElement {
      fixture.detectChanges();
      const firstChildDe = componentDe.query(By.css('#trigger-here'));
      const firstChild = firstChildDe.nativeElement as HTMLElement;
      return firstChild.children[0] as HTMLElement;
    }
  });

  describe('Class when sticky', () => {
    it('should put and remove the classes when sticky', (done: DoneFn) => {
      const indicatorSub = new Subject();

      const stickyElementDe = componentDe.query(By.directive(StickyDirective));
      const stickyElement = stickyElementDe.nativeElement as HTMLElement;

      // Just make a middleware to call indicatorSub.next and indicate when the function onAppears was executed
      (directive as any).onAppears = new Proxy(
        (directive as any).onAppears,
        {
          apply: (target, thisArg, argumentsList) => {
            target.apply(thisArg, argumentsList);
            indicatorSub.next();
          }
        }
      );

      const scrollAreaDe = componentDe.query(By.css('#body-container'));
      const scrollArea = scrollAreaDe.nativeElement as HTMLElement;

      const scroll = (number: number) =>
        scrollArea.scrollBy({
          top: number
        });

      of({}).pipe(
        // Scroll down 500px
        tap(() => scroll(500)),
        // wait until the subject indicates
        concatMap(() => indicatorSub.asObservable().pipe(take(1))),
        // Verify if the the element has the class
        tap(() => expect(stickyElement.classList.contains('when-sticky')).toBeTruthy('should have the class')),
        // Scroll up to the beginning
        tap(() => scroll(-500)),
        // wait until the subject indicates
        concatMap(() => indicatorSub.asObservable()),
        // Verify if the the element doesn't have the class
        tap(() => expect(stickyElement.classList.contains('when-sticky')).toBeFalsy('the class should be removed')),
      ).subscribe(
        // Indicate that we are done
        () => done()
      );
    });
  });
});
