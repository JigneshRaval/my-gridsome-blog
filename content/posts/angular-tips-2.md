## Angular Tips & Tricks
------------

## `ngOnDestroy` Alternatives, Using `@HostHostListener`

On refresh or when you navigate away from the current page, then ngOnDestroy won't be called. The application will just be destroyed by the browser.

Only when Angular2 removes the component from the DOM because you move away or you call destroy() on a dynamically created component, then ngOnDestroy() is called.

You can listen to beforeunload and unload yourself if you need some action to happen before the application is destroyed by the browser.

See also

https://developer.mozilla.org/en-US/docs/Web/Events/unload
How can we detect when user closes browser? (Angular)

```
@HostListener('window:unload', ['$event'])
unloadHandler(event) {
    console.log('window:unload Fired...');
}

@HostListener('window:beforeunload', ['$event'])
beforeUnloadHander(event) {
    console.log('window:beforeunload Fired...');
}
```
https://stackoverflow.com/questions/45898948/angular-4-ngondestroy-in-service-destroy-observable/45898988

```
// EXAMPLE
// ==========================
@Injectable()
class Service implements OnDestroy {
  ngOnDestroy() {
    console.log('Service destroy')
  }
}

@Component({
  selector: 'foo',
  template: `foo`,
  providers: [Service]
})
export class Foo {
  constructor(service: Service) {}

  ngOnDestroy() {
    console.log('foo destroy')
  }
}

@Component({
  selector: 'my-app',
  template: `<foo *ngIf="isFoo"></foo>`,
})
export class App {
  isFoo = true;

  constructor() {
    setTimeout(() => {
        this.isFoo = false;
    }, 1000)
  }
}
```

## RxJS Imports

```
// Import all

import Rx from "rxjs/Rx";

Rx.Observable
  .interval(200)
  .take(9)
  .map(x => x + "!!!")
  .bufferCount(2)
  .subscribe(::console.log);

// Add operators (my favourite)

import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/take";
import "rxjs/add/operator/map";
import "rxjs/add/operator/bufferCount"

Observable
  .interval(200)
  .take(9)
  .map(x => x + "!!!")
  .bufferCount(2)
  .subscribe(::console.log);
```
```
// JavaScript ES7 Function Bind Syntax

import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/interval";
import {take} from "rxjs/operator/take";
import {map} from "rxjs/operator/map";
import {bufferCount} from "rxjs/operator/bufferCount"

Observable
  .interval(200)
  ::take(9)
  ::map(x => x + "!!!")
  ::bufferCount(2)
  .subscribe(::console.log);
```

## Memory Leaks in Angular
https://stackoverflow.com/questions/39011677/memory-leaks-in-angular2

In the browser, Angular is just JavaScript, so the typical caveats apply.

One thing that Angular specifically warns against though is Observables. Once you subscribe to one, it will keep working until you unsubscribe, even if you navigate to another view. Angular unusbscribes for you where possible (eg if you use the async pipe in the template:

```
// model

// listenToServer returns an observable that keeps emitting updates
serverMsgs = httpService.listenToServer();

// template

<div>{{serverMsgs | async}}</div>
```
Angular will show server messages in the div, but end the subscription when you navigate away.

However, if you subscribe yourself, you have to also unsubscribe:
```
// model

msgs$ = httpService.listenToServer().subscribe(
    msg => {this.serverMsgs.push(msg); console.log(msg)}
);

// template

<div *ngFor="let msg of serverMsgs">{{msg}}</div>
```

When you navigate away, even though you cannot see new messages appear in the view, you will see them printed to the console as they arrive. To unsubscribe when the component is disposed of, you would do:

`ngOnDestroy(){ this.msgs$.unsubscribe(); }`

**From the docs:**
we must unsubscribe before Angular destroys the component. Failure to do so could create a memory leak.

---------------------------- TUTORIALS -------------------------

https://www.dwmkerr.com/fixing-memory-leaks-in-angularjs-applications/
https://auth0.com/blog/four-types-of-leaks-in-your-javascript-code-and-how-to-get-rid-of-them/

---------------------------------------------------
https://github.com/primefaces/primeng/blob/61b8aaa82bbe875b881da9c926c95f2a4ac30bbd/src/app/showcase/components/terminal/terminaldemo.ts

```
import {Component,OnDestroy} from '@angular/core';
import {TerminalService} from '../../../components/terminal/terminalservice';
import {Subscription}   from 'rxjs/Subscription';

@Component({
    templateUrl: './terminaldemo.html',
    providers: [TerminalService]
})
export class TerminalDemo implements OnDestroy {

    subscription: Subscription;

    constructor(private terminalService: TerminalService) {
        this.subscription = this.terminalService.commandHandler.subscribe(command => {
            let response = (command === 'date') ? new Date().toDateString() : 'Unknown command: ' + command;
            this.terminalService.sendResponse(response);
        });
    }

    ngOnDestroy() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
```
```
declare global {
    interface Window { MyNamespace: any; }
}

window.MyNamespace = window.MyNamespace || {};
```
--------------------------------- Index.html
```
function destroyApp() {
    console.log('destroyApp :', window.debugStuff.app);
    window.debugStuff.app.destroy();
    window.debugStuff.platform.destroy();
    delete window.debugStuff;

    logInfo();
}

function logInfo() {
    console.log('getAllAngularRootElements', getAllAngularRootElements());
    console.log('getAngularTestability', getAngularTestability(getAllAngularRootElements()[0]));
}

window.addEventListener("beforeunload", destroyApp);
```
// Main.ts -------------------------
```
declare global {
  interface Window { debugStuff: any; }
}
```

```
function _window() {
  return window;
}
```

```
platformBrowserDynamic().bootstrapModule(AppModule).then((ref) => {
  console.log("storing stuff for destroying later");
  window.debugStuff =  {
    app: ref,
    platform: platformBrowserDynamic()
  }

});
```

```
export default {
  resolve: {
    alias: {
      'angular': path.resolve(path.join(__dirname, 'node_modules', 'angular'))
     },
     //...
  },
  // ...
}
```

```
var $timer = $('#timer'),
    count = 0;

//set the interval
var interval = setInterval(function() {
    $timer.html(count++);
}, 1000);
console.log('the interval is: '+interval);

//clear it
$('button').bind('click', function(e) {
    var found;
    for(i=0; i<10000; i++)
    {
        window.clearInterval(i);
    }
});
```

```
// EXAMPLE 1
// ===================================
platformBrowserDynamic().bootstrapModule(AppModule, {ngZone: 'noop'}).then(ref => {
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;

  // Otherise, log the boot error
}).catch(err => console.error(err));

// EXAMPLE 2
// ===================================

//platformBrowserDynamic().bootstrapModule(AppModule);
const moduleRef = platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {
  console.log('Bootstraping Styleguide..', ref);
  // Ensure Angular destroys itself on hot reloads.
  if (window['ngRef']) {
    window['ngRef'].destroy();
    window['ngRef'] = null;
  }
  window['ngRef'] = ref;

  // Otherise, log the boot error
}).catch(err => console.error(err));

console.log('moduleRef :',moduleRef)
```

### ChangeDetectionStrategy

`changeDetection: ChangeDetectionStrategy.OnPush`

## Using Angular trackBy
```
<ul>
  <li *ngFor="let song of songs; trackBy: trackSongByFn">{{song.name}}</li>
</ul>

trackByFn(index, song) {
    return index; // or song.id
}
```

## Import .json files in Angular
```
// typings.d.ts:
// ============================
declare module "*.json" {
  const value: any;
  export default value;
}
declare module "json!*" {
  const value: any;
  export default value;
}

// Then in normal .ts file:
// ============================
import * as manifestData from '../al-assets/data/manifest.json';
console.log('manifestData ===> ', (<any>manifestData));
console.log('manifestData : Name ===> ', (<any>manifestData).name);
console.log('manifestData : Version ===> ', (<any>manifestData).version);
console.log('manifestData : Dependencies ===> ', (<any>manifestData).dependencies);
console.log('manifestData : Tile Widget Version ===> ', (<any>manifestData).dependencies['@alight/tileswidget']);

// OR using simple Javascript
<script>
let manifestUrl = './al-assets/data/manifest.json';
  fetch(manifestUrl)
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                return response.json()
            }).then((data)=> {
              console.log('Base app version :', data.version);
            })
</script>
```

## Linking other NPM module one App
```
// Change from
// ====================
resolve: {
	extensions: ['.ts', '.js'],
	modules: ['node_modules', nodeModules],
	symlinks: !buildOptions.preserveSymlinks
},
resolveLoader: {
	modules: [nodeModules, 'node_modules']
},

// Change To
// ================================
resolve: {
	extensions: ['.ts', '.js'],
	//modules: ['node_modules', nodeModules],
	alias: { "@angular": path.join(nodeModules, "/@angular") },
	symlinks: !buildOptions.preserveSymlinks
},
resolveLoader: {
	modules: ['node_modules']
},

// In angular-cli.json

"defaults": {
    "styleExt": "scss",
    "component": {},
    "serve": {
      "port": 4400
    },
    "build": {
      "preserveSymlinks": true
    }
  }
```

## Remove spinner arrows from HTML input type Number
```
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: textfield;
    margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
```

## Angular 4 Events
```
(focus)="myMethod()"  // An element has received focus
(blur)="myMethod()"   // An element has lost focus

(submit)="myMethod()"  // A submit button has been pressed

(scroll)="myMethod()"

(cut)="myMethod()"
(copy)="myMethod()"
(paste)="myMethod()"

(keydown)="myMethod()"
(keypress)="myMethod()"
(keyup)="myMethod()"

(mouseenter)="myMethod()"
(mousedown)="myMethod()"
(mouseup)="myMethod()"

(click)="myMethod()"
(dblclick)="myMethod()"

(drag)="myMethod()"
(dragover)="myMethod()"
(drop)="myMethod()"
```

## Angular 2+ Classes with NgClass and NgStyle

```
// Vanilla JavaScript way
// ==========================================

<div id="my_id">This is a div written in black.</div>

var divToChange = document.getElemetById('my_id');

//to change the class we would do.
divToChange.className = "newclass";

//if we want to add multiple classes, we could just do
divToChange.className = "newclass secondclass thirldclass";

//if we want to add a class name without removing the class present before, we do:
divToChange.className = divToChange.className.concat(" addedwit");

//to change the background color of such an element, we would also have to do.
divToChange.style.background-color = "red";

//to change the color of such an element would need
divToChange.style.color = "white";

//Which we would agree is a bit more stressful than what angular ships with us.
```

```typescript
// In Angular

// EXAMPLE 1 : Using the [style.property] Binding.
// ==========================================
//function to get random colors
public getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
this.randomcolor = this.getRandomColor();

<div [style.color]="randomcolor"> I would be styled with different colors dynamically </div>
```

```typescript
// EXAMPLE 2 : Using the [ngStyle] Binding
// ==========================================
public font_size="12px";
public background_color="grey ";

<!--call the style object to style class -->
<div [ngStyle]="{ 'color': getRandomColor(), 'font-size': font_size, 'background-color': background_color }"> I would be styled with different colors dynamically </div>

<!--attach a click function to this button to set the style dynamically -->
<input type="text" [(ngModel)]="background_color" placeholder="background_color">
<input type="text" [(ngModel)]="font_size" placeholder="font_size">
```

```typescript
// EXAMPLE 3 : Class Binding using 'className' directive
// ==========================================

<div [className]="condition ? 'active' : 'inactive'"></div>

// src/app/app.component.css
.style1 {
    font-family: verdana;
    font-size: 20px;
}

.style2 {
    color: red;
    text-align: center;
}

<!--call the ngclass object to add a class name to it. this is same as class="style1" -->
<div [className]="'style1'"> I would be classed using class name</div>

// Advanced usage of className ( Apply classname dynamically )
// ============================

//declare a variable to hold class name:
public my_Class = 'style1';

//function to change the class from style1 to style 2 when clicked
toggle_class(){
    if(this.my_Class=="style1"){
        this.my_Class='style2';
    }else{
        this.my_Class='style1';
    }
}
<!--call the ngclass object to add a class name to it. -->
<div [className]="my_Class"> I would be classed using classname</div>

<!--button to change the class -->
<button (click)="toggle_class()">Toggle_class</button>

<div [class.active]="condition"></div>
```

```typescript
// EXAMPLE 4 : Using the ngClass Binding
// ==========================================
<div [ngClass]="['style1', 'style2']">array of classes</div>
// OR ***
<div [ngClass]="'style1 style2'">string of classes</div>
// OR
<div [ngClass]="{'style1': true, 'style2': true}">object of classes</div>

// USAGE :
//variable to hold boolean value to style1
isClass1Visible: false;

//variable to hold boolean value to style2
isClass2Visible: false;

<!--call the classes in the objects and their value -->
<div [ngClass]="{
  'style1': isClass1Visible,
  'style2': isClass2Visible
}">object of classes</div>

// OR

<div [ngClass]="{
  'is-active': condition,
  'is-inactive': !condition,
  'is-focused': condition && anotherCondition,
}">
</div>

<!--button to togggle style1 -->
<button (click)="isClass1Visible = !isClass1Visible;">Toggle style 1</button>

<!-- button to toggle style2 -->
<button (click)="isClass2Visible = !isClass2Visible;">Toggle style 2</button>
```

```typescript
// EXAMPLE 5
// ==========================================
<p [style.background-color]="'darkorchid'">
  Quite something!
</p>

// You can also specify the unit, here for example we set the unit in em, but px, % or rem could also be used:

<p [style.font-size.em]="'3'">
  A paragraph at 3em!
</p>

// conditionaly set a style value depending on a property of the component:

<p [style.font-size.px]="isImportant ? '30' : '16'">
  Some text that may be important.
</p>
```

```typescript
// EXAMPLE 6 : NgStyle for multiple values
// ==========================================
myStyles = {
  'background-color': 'lime',
  'font-size': '20px',
  'font-weight': 'bold'
}

<p [ngStyle]="myStyles">
  You say tomato, I say tomato
</p>

// OR

<p [ngStyle]="{'background-color': 'lime',
    'font-size': '20px',
    'font-weight': 'bold'}">
  You say tomato, I say tomato
</p>
```

```typescript
// EXAMPLE 7 : NgStyle using function
// ==========================================
setMyStyles() {
  let styles = {
    'background-color': this.user.isExpired ? 'red' : 'transparent',
    'font-weight': this.isImportant ? 'bold' : 'normal'
  };
  return styles;
}

<p [ngStyle]="setMyStyles()">
  You say tomato, I say tomato
</p>
```

## Class Binding & NgClass in Angular 2

```typescript
// EXAMPLE 1 : NgStyle using function
// ==========================================
isActive = false;

`<div [class.active]="isActive">
  ...
</div>`

// NgClass for multiple classes

myClasses = {
  important: this.isImportant,
  inactive: !this.isActive,
  saved: this.isSaved,
  long: this.name.length > 6
}

`<div [ngClass]="myClasses">
  ...
</div>`


// NgClass using function return

setMyClasses() {
  let classes = {
    important: this.isImportant,
    inactive: !this.isActive,
    saved: this.isSaved,
    long: this.name.length > 6
  };
  return classes;
}

`<div [ngClass]="setMyClasses()">
  ...
</div>`
```

## Angular : Directives + Renderer2
### Using Renderer2 in Angular
https://alligator.io/angular/using-renderer2/

The Renderer2 class is an abstraction provided by Angular in the form of a service that allows to manipulate elements of your app without having to touch the DOM directly. This is the recommended approach because it then makes it easier to develop apps that can be rendered in environments that don’t have DOM access, like on the server, in a web worker or on native mobile.

**Note** Note that the original Renderer service has now been deprecated in favor of Renderer2

You’ll often use Renderer2 in custom directives because of how Angular directives are the logical building block for modifying elements.

```typescript
import { Directive, Renderer2, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appGoWild]'
})
export class GoWildDirective implements OnInit {
  // Notice how we also use ElementRef to get access to the
  // underlining native element that our directive is attached-to.

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'wild');

    // OR
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText('Hello world!');

    this.renderer.appendChild(div, text);
    this.renderer.appendChild(this.el.nativeElement, div);

    // setAttribute / removeAttribute
    this.renderer.setAttribute(this.el.nativeElement, 'aria-hidden', 'true');

    // addClass / removeClass
    this.renderer.removeClass(this.el.nativeElement, 'wild');

    // setStyle / removeStyle
    this.renderer.setStyle(
      this.el.nativeElement,
      'border-left',
      '2px dashed olive'
    );

    this.renderer.removeStyle(this.el.nativeElement, 'border-left');

    // setProperty
    this.renderer.setProperty(this.el.nativeElement, 'alt', 'Cute alligator');

    this.renderer.setProperty(this.el.nativeElement, 'value', 'Cute alligator');
  }
}

<h1 appGoWild>
  Hello World!
</h1>

// OUTPUT
<h1 class="wild">Hello World!</h1>
```
### Click outside directive in Angular 2
https://chyngyz.github.io/click-outside-directive/
``` typescript
// EXAMPLE 2 : Click outside directive in Angular 2
// ==========================================

import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  // As our directive will fire an event on click,
  // we need to inject EventEmitter and assign an @Output() variable as an EventEmitter.

  @Output public clickOutside = new EventEmitter();
  // @Output public clickOutsideEvent = new EventEmitter();

  // In order to access the current DOM element on which we apply the current directve,
  // we need to inject ElementRef in the directive’s constructor.

  constructor(private _elementRef : ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

    // condition that checks if the click event was on the current element or not; and if not,
    // we just fire the function that is bound on our EventEmitter.

    const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!isClickedInside) {
        this.clickOutside.emit(null);
    }
  }
}

// HTML
<div class="my-class" clickOutside (clickOutsideEvent)="fireEvent()"></div>

// OR

<div class="my-class" (clickOutside)="fireEvent()"></div>
```

## Angular Errors

```
// ERROR 1

ERROR in Metadata version mismatch for module C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacyhelprequestcreationwidget/node_modules/primeng/components/dropdown/dropdown.d.ts, found version 4, expected 3, resolving symbol AdvocacyHelpRequestCreationWidgetModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacyhelprequestcreationwidget/src/index.ts, resolving symbol AdvocacyHelpRequestCreationWidgetModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacyhelprequestcreationwidget/src/index.ts


// ERROR 2

uncaught Error: Component Tab1ContentComponent is not part of any NgModule or the module has not been imported into your module.


// ERROR 3

Could not find a declaration file for module 'lodash'. 'c:/jr/__UPointNext/NextGen-v3/ui-core-widget/node_modules/lodash/lodash.js' implicitly has an 'any' type.

Solution: Try `npm install @types/lodash` if it exists or add a new declaration (.d.ts) file containing `declare module 'lodash';`
```

### Angular: Set Focus on Element

https://www.thecodecampus.de/blog/angular-2-set-focus-element/

```typescript
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'my-app',
  styleUrls: [ './app.component.css' ],
  template: `
             <input #myInput/>
             <button (click)="setFocus('myInput')">Focus Input</button>
            `
})
export class AppComponent  {
  @ViewChild('myInput') myInput: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setFocus() {
    if (isPlatformBrowser(this.platformId)) {
      this.myInput.nativeElement.focus();
    }
  }
}
```

### Call a method on @Input() change

https://www.thecodecampus.de/blog/call-a-method-when-input-changes/

```typescript
private _filter: string;

@Input()
set filter(value: string) {
  this._filter = value;
  if (value !== null) {
    // call your stuff
    this.filterMyData(value);
  }
}
get filter() {
  return this._filter;
}
```

### Solution

You could use the `OnChanges` interface with the `ngOnChanges(changes: SimpleChanges): void` Method to listen to all `@Input()` changes.
