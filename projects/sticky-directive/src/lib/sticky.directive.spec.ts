import { Component, DebugElement, ViewChild, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyDirective } from './sticky.directive';
import { By } from '@angular/platform-browser';

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
      position: sticky;
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

  it('should add sticky css prop', () => {
    const nativeElement: HTMLElement = directiveDe.nativeElement;
    expect(nativeElement.style.position).toEqual('sticky');
    expect(nativeElement.style.top).toEqual('0px');
    expect(nativeElement.style.zIndex).toEqual('10');
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
    });

  });

  describe('Put Sentinel', () => {
    it('should add sentinel right after the triggerOn element', () => {
      const firstChildDe = componentDe.query(By.css('#trigger-here'));
      const firstChild = firstChildDe.nativeElement as HTMLElement;
      const sentinel = firstChild.children[0] as HTMLElement;

      expect(sentinel).toBe((directive as any).sentinel);
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
        directive.debugMode = false;
        const sentinel = (directive as any).generateSentinelElement();
        expect(sentinel.style.backgroundColor).toEqual('');
        expect(sentinel.style.visibility).toEqual('hidden');
      });
    });
  });

});
