# ngx-sticky-directive

[![npm version](https://badge.fury.io/js/ngx-sticky-directive.svg)](https://badge.fury.io/js/ngx-sticky-directive) [![Build Status](https://travis-ci.org/bikecoders/ngx-sticky.svg?branch=master)](https://travis-ci.org/bikecoders/ngx-sticky)

[![coverage](https://sonarcloud.io/api/project_badges/measure?project=bikecoders_ngx-sticky&metric=coverage)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky) [![reliability rating](https://sonarcloud.io/api/project_badges/measure?project=bikecoders_ngx-sticky&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky) [![security rating](https://sonarcloud.io/api/project_badges/measure?project=bikecoders_ngx-sticky&metric=security_rating)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky) [![scale rating](https://sonarcloud.io/api/project_badges/measure?project=bikecoders_ngx-sticky&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky)

[![Quality Gate](https://sonarcloud.io/api/project_badges/quality_gate?project=bikecoders_ngx-sticky)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky) [![Sonar Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=bikecoders_ngx-sticky)


## TL;DR:

Angular directive that adds sticky position to an HTML element and also applies and remove a custom class when the element is sticky positioned.

```html
<div #scContainer>
  <div
    ngxSticky
    classWhenSticky="my-sticky-class"
    triggerOn="text-content"
    [scrollContainer]="scContainer"
  >
    Sticky Title
  </div>
  <div id="text-content">
    ...
  </div>
</div>
```
[![Quick Demo](https://raw.githubusercontent.com/bikecoders/ngx-sticky/master/docs-img/demo-capture.gif)]()

## How to use it

To accomplish the desired behavior you need to take in account the following:
  - You need to have a scroll container
  - Inside the scroll container you need:
    - The sticky element
    - An element that when the sticky element bypass it, the directive will trigger the custom class. We call this _triggerOn_ element
  - The _triggerOn_ element **must** be relative positioned (has this css property `position: relative`)
    - > _We decided that you control this, because adding `position: relative` to an element can change the visual aspect to something not desired and you will asking why and blaming yourself for something that you are not conscious of, so following the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) this directive will not take care of that_

`dummy.component.scss`
```scss
.scroll-container {
  border: #cccccc 1px solid;
  height: 75vh;
  overflow-y: auto;
  padding: 8px;
}

.title {
  background-color: #1C5089;
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  padding: 16px;
}

.trigger-on {
  position: relative;
}

.my-sticky-class {
  background-color: #1C8950 !important;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
}
```

`dummy.component.html`
```html
<div #scContainer>
  <div
    ngxSticky
    class="title"
    triggerOn="trigger-on"
    classWhenSticky="my-sticky-class"
    [scrollContainer]="scContainer"
  >
    Sticky Title
  </div>
  <div id="trigger-on" class="trigger-on">
    ...Insert a lot of content here
  </div>
</div>
```

## Demo
- online demo: https://bikecoders.github.io/ngx-sticky/
- [demo-app](https://github.com/bikecoders/ngx-sticky/tree/master/src): Source code available


## Getting started

1. Install `ngx-sticky-directive`:

```bash
# using npm
npm install ngx-sticky-directive --save

# using yarn <3
yarn add ngx-sticky-directive
```

2. Import the installed library:

```ts
import { StickyDirectiveModule } from 'ngx-sticky-directive';

@NgModule({
  ...
  imports: [
    ...
    StickyDirectiveModule
  ]
})
export class AppModule { }
```

3. Use it in your component

```ts
@Component({
  selector: 'dummy-component',
  styles: [`
    .body-container {
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
    <div class="body-container" #scCont>
      <div
        id="sticky-component"
        ngxSticky
        classWhenSticky="when-sticky"
        triggerOn="trigger-on"
        [scrollContainer]="scCont"
      >
      </div>
      <div id="trigger-on" class="super-height">
      </div>
    </div>
  `,
})
class DummyComponent {
}
```

## Properties

| Name  | Description |
| :---- | :---------- |
| `@Input() scrollContainer: string | ElementRef | HTMLElement` | Top container of the sticky element that has the scroll. _If an string is provided, it must be the ID of the element._ |
| `@Input() triggerOn: string | ElementRef | HTMLElement` | When the sticky element bypass this element the custom class will apply. _If an string is provided, it must be the ID of the element._ |
| `@Input() debugMode: boolean` | Display or hide the sentinel element. |
| `@Input() classWhenSticky: string` | CSS class to be added to the target element when becomes sticky. |
| `@Input() zIndex: number = 10` | CSS `zIndex` value to set to the target element. By default is 10. |
| `@Input() top: number = 0` | CSS `top` value to set to the sticky element. By default is 0. |

## Why?

Adding a custom class when an element becomes sticky is the objective of this directive. This is achieved by using [Intersection Observer](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) and avoid using scroll events to keep a good performance.

## How it works

We don't want to use scroll events to detect when an element becomes sticky on the screen for performance reasons. That why we decided to use Interception Observer.

The Interception Observer is preferably applied to an element that has a scroll and it detects when a child element enters or exits the screen. So we add an invisible sentinel element to that scroll container and when it exists the screen we know when the sticky element start to be sticky, when the sentinel enters again the sticky element is not longer sticky. In our demo you can toggle the visibility of the sentinel and check how the intersection occurs.

The intention of this directive is to implement the article [An event for CSS position:sticky](https://developers.google.com/web/updates/2017/09/sticky-headers) in an Angular way.

### References
- [An event for CSS position:sticky](https://developers.google.com/web/updates/2017/09/sticky-headers)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Creating_an_intersection_observer)


## Development tips

If you want to contribute with features, we recommend to read the section that we wrote about Development Tips that is in the
[Wiki](https://github.com/bikecoders/ngx-sticky/wiki#development-tips)