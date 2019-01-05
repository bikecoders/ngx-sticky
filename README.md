

# ngx-sticky-directive

> TODO: Create badges

## TL;DR:

Angular directive that adds sticky position to an HTML element and also applies and remove a custom class when the element is sticky positioned.

```html
<div #scContainer>
  <div
    ngxSticky
    [scrollContainer]="scContainer"
    [triggerOn]="'text-content'"
    [classWhenSticky]="'my-sticky-class'"
  >
    Sticky Title
  </div>
  <div id="text-content">
    ...
  </div>
</div>
```
> TODO: create a GIF to display briefly how it works

### How to use it
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

.my-sticky-class {
  background-color: #891E1C !important;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
}
```


`dummy.component.html`
```html
<div #scContainer>
  <div
    ngxSticky
    [scrollContainer]="scContainer"
    [triggerOn]="'text-content'"
    [classWhenSticky]="'my-sticky-class'"
    class="title"
  >
    Sticky Title
  </div>
  <div id="text-content">
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
        [classWhenSticky]="'when-sticky'"
      >
      </div>
      <div id="trigger-here" class="super-height">
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
| `@Input() scrollContainer: string | ElementRef | HTMLElement` | Top container of the sticky element that has the scroll. |
| `@Input() triggerOn: string | ElementRef | HTMLElement` | Element that will trigger the custom class on the sticky element. |
| `@Input() debugMode: boolean` | Display or hide the sentinel element. |
| `@Input() classWhenSticky: string` | Class to be added to the target element when becomes sticky. |
| `@Input() zIndex: number = 10` | zIndex value to set to the target element. By default is 10. |
| `@Input() top: number = 0` | Top value to set to the target element. By default is 0. |

## Why?

Adding a custom class when an element becomes sticky is the objective of this directive. This is achieved by using Intersection Observer and avoid scroll events to keep a good performance.
This directive adds an element (which we called Sentinel) on top of the element that will trigger the sticky behavior, whit our sentinel and using intersection observer we can determine when the sticky mode enters and exits.

### References
- [An event for CSS position:sticky](https://developers.google.com/web/updates/2017/09/sticky-headers)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Creating_an_intersection_observer)
