---
title: Angular 4/5 Tips and Tricks
date: 2019-02-06
published: true
tags: ['Angular','Tips and Tricks']
canonical_url: false
description: "Markdown is intended to be as easy-to-read and easy-to-write as is feasible. Readability, however, is emphasized above all else. A Markdown-formatted document should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions."
---

# Angular 4/5 Tips

## 1. Solution to problem — Property ‘map’ does not exist on type ‘Observable<Response>’

### Solution 1

**Source:**  <a href="https://medium.com/@colin_78999/solution-to-problem-property-map-does-not-exist-on-type-observable-response-cccd13b07145">Solution to problem — Property ‘map’ does not exist on type ‘Observable<Response>’</a>

When writing http code in Angular, it is a common patter to map the response Observable, e.g.

```
this.http.post(uploadUrl, formData)
  .map((res: Response) => res.json())
```

However, in a new project, it is possible to get this error

> TS2339: Property ‘map’ does not exist on type ‘Observable<Response>’.

The solution is to add

```
import 'rxjs/add/operator/map';
```

### Solution 2

**Source:**  <a href="https://github.com/angular/angular-cli/issues/3249">ng test error: Property 'map' does not exist on type 'Observable<Response>'</a>

I solved issue by adding following includes in `test.ts` file in src/app folder in my solution

```
import 'core-js/es6';
import 'core-js/es7/reflect';

import 'ts-helpers';

import 'zone.js/dist/zone.js';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import 'rxjs/Rx';
```

========================================================
1. Error while prod build : "$$_gendir/app/app.module.ngfactory"
	Ref : https://github.com/angular/angular-cli/issues/7125
	------------------------------------------------------
	I can confirm that ng new project-name problem with "$$_gendir/app/app.module.ngfactory" can be resolved by:

	npm install enhanced-resolve@3.3.0 --save;
	ng build --prod --aot; (result: now everything is OK)

	also ng build --prod its not this same as ng build --env=prod

	Generic type 'HttpEvent' requires 1 type argument(s).

2. Assets path when linking one app into another app using "npm link"
	// CSS Path in main.scss
	------------------------------------
	/* This is the main CSS that includes other CSS files. */

	/**
	 * TODO: Need to find better solution
	 * Need to find proper way to provide path of images used inside CSS or SCSS files because
	 * modules linked ( using "npm link" ) inside another app then images path of linked module/app
	 * not working properly
	 */
	@import "base-path.scss";
	//$assetsPath: $APP_URL;//"../../assets";

	/**
	 * TODO: Need to find better solution
	 * Uncomment below path when using UI-core inside UI-styleguide or in another app
	 */
	$assetsPath: "..";
	$assetsPath: "../node_modules/@mywidget/uicore/src/al-assets";

3. var myZone = zone.fork({
            afterTask: function() {
                console.log('addEventListener hook: ', arguments);
            }
        });
        myZone.run(function() {
            window.addEventListener('click', function() {
                console.log('click!');
            });
        });

4. this.__zone_symbol__clickfalse[0].callback()


5. Using Npm Link : common.js in C:\jr\style-guide-app-linked\node_modules\@angular\cli\models\webpack-configs\common.js

	Update this code with below code: ------------------
	resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules', nodeModules],
            symlinks: !buildOptions.preserveSymlinks
        },
        resolveLoader: {
            modules: [nodeModules, 'node_modules']
        },

	New Code: ------------------------
	resolve: {
            extensions: ['.ts', '.js'],
            //modules: ['node_modules', nodeModules],
			alias: { "@angular": path.join(nodeModules, "/@angular") }
            //symlinks: true
        },
        resolveLoader: {
            modules: ['node_modules']
        },

	Example: -------------------------
	resolve: {
        extensions: ['.js', '.ts', '.css'],
        // This will resolve module path when using "npm link"
        alias: { "@angular": path.join(__dirname, "node_modules/@angular") }
    },
    resolveLoader: {
        modules: ["node_modules"] // This will resolve module path when using "npm link"
    },

6. when you are using "npm link" to link one app into another ( https://github.com/jvandemo/generator-angular2-library )

  Note : Remove so many Warnings regarding "can not resolve *.ts" file

```
WARNING in ./~/apollo-client/index.js
(Emitted value instead of an instance of Error) Cannot find source file '../../src/index.ts': Error: Can't resolve '../../src/index.ts' in 'C:\Dev\app_ma
nager\ui\node_modules\apollo-client'
 @ ./~/react-apollo/lib/browser.js 10:22-46
 @ ./src/index.tsx
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src/index.tsx

WARNING in ./~/apollo-client/transport/networkInterface.js
(Emitted value instead of an instance of Error) Cannot find source file '../../../src/transport/networkInterface.ts': Error: Can't resolve '../../../src/
transport/networkInterface.ts' in 'C:\Dev\app_manager\ui\node_modules\apollo-client\transport'
 @ ./~/apollo-client/index.js 1:0-98
 @ ./~/react-apollo/lib/browser.js
 @ ./src/index.tsx
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src/index.tsx

WARNING in ./~/apollo-client/transport/batchedNetworkInterface.js
(Emitted value instead of an instance of Error) Cannot find source file '../../../src/transport/batchedNetworkInterface.ts': Error: Can't resolve '../../
../src/transport/batchedNetworkInterface.ts' in 'C:\Dev\app_manager\ui\node_modules\apollo-client\transport'
 @ ./~/apollo-client/index.js 2:0-115
 @ ./~/react-apollo/lib/browser.js
 @ ./src/index.tsx
 @ multi (webpack)-dev-server/client?http://localhost:8080 ./src/index.tsx
 ```

	ng serve --preserve-symlinks

		If you are using an Angular CLI application to consume your library, make sure to set up a path mapping in /src/tsconfig.app.json of your consuming application (not your library):
	{
	  "compilerOptions": {
		// ...
		// Note: these paths are relative to `baseUrl` path.
		"paths": {
		  "@angular/*": [
			"../node_modules/@angular/*"
		  ]
		}
	  }
	}
	When you npm link a library with peer dependencies, the consuming application searches for the peer dependencies in the library's parent directories instead of the application's parent directories.

	If you get Error: Unexpected value '[object Object]' imported by the module 'AppModule'. Please add a @NgModule annotation., then try:

	$ ng serve --preserve-symlinks
	to make sure the consuming application searches for the peer dependencies in the application's node_modules directory.

	Example 2: changes in angular.cli ( Worked )
	---------------------------------------------
		After upgrade, either run

		ng serve --preserve-symlinks

		or update .angular-cli.json

		...
		"defaults": {
			"styleExt": "css",
			"component": {},
			"build": {
				"preserveSymlinks": true
			}
		}

		if you have symlinks in the source tree.


7. YARN Cheeatshet
	npm install === yarn
	Install is the default behavior.
	npm install taco --save === yarn add taco
	The Taco package is saved to your package.jsonimmediately.
	npm uninstall taco --save === yarn remove taco
	—-savecan be defaulted in NPM by npm config set save true but this is non-obvious to most developers. Adding and removing from package.json is default in Yarn.
	npm install taco --save-dev === yarn add taco --dev
	npm update --save === yarn upgrade
	Great call on upgrade vs update, since that is exactly what it is doing! Version number moves, upgrade is happening!
	*WARNING* npm update --save seems to be kinda broken in 3.11
	npm install taco@latest --save === yarn add taco
	npm install taco --global === yarn global add taco
	As always, use global flag with care.
	You can use this to use yarn to update itself with yarn self-update

	npm init === yarn init
	npm link === yarn link
	npm outdated === yarn outdated
	npm publish === yarn publish
	npm run === yarn run
	npm cache clean === yarn cache clean
	npm login === yarn login (and logout)
	npm test === yarn test
	npm install --production === yarn --production
	yarn autoclean [-I/--init] [-F/--force]

8. You can wrap ng-content in ng-template and use ngTemplateOutlet

	<a class="bouton" href="{{ href }}" *ngIf="hasURL">
		<ng-container *ngTemplateOutlet="contentTpl"></ng-container>
	</a>

	<button class="bouton" *ngIf="!hasURL">
		<ng-container *ngTemplateOutlet="contentTpl"></ng-container>
	</button>
	<ng-template #contentTpl><ng-content></ng-content></ng-template>

9. <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>

	<some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>

	<some-element [ngStyle]="objExp">...</some-element>

10. <ng-container [ngSwitch]="thing.name">
		<div [ngSwitchCase]="'foo'">
			Inner content 1
		</div>
		<div [ngSwitchCase]="'bar'">
			Inner content 2
		</div>
		<div [ngSwitchCase]="'cat'">
			Inner content 3
		</div>¯
		<div [ngSwitchCase]="'dog'">
			Inner content 4
		</div>
	</ng-container>

```
<ng-container
  *ngIf="isLoggedIn; then loggedIn; else loggedOut">
</ng-container>

<ng-template #loggedIn>
  <div>
    Welcome back, friend.
  </div>
</ng-template>
<ng-template #loggedOut>
  <div>
    Please friend, login.
  </div>
</ng-template>
```

11. <ng-template #followingpost let-author="author" let-age="age" let-text="text" let-badge="badge">
    <div class="container-fluid">
        <div class="card">
            <div class="header">
                <h4 class="title">{{ author }}</h4>
                <p class="category">il y a {{ age }} jours</p>
            </div>

            <div class="content" [innerHTML]="text">
            </div>

            <div class="text-right">
                <button class="btn btn-icon btn-simple"><i class="ti-comment"></i></button>
                <button class="btn btn-icon btn-simple">
                    <i class="ti-heart"></i>
                    <span *ngIf="badge" class="badge">{{ badge }}</span>
                </button>
                <button class="btn btn-icon btn-simple"><i class="ti-share"></i></button>
            </div>
        </div>
    </div>
</ng-template>

<ng-container *ngTemplateOutlet="followingpost;context:{author: 'Timothy', age: 2, badge: 18, text: 'Les Français qui payent plus de 2500 € d impôt peuvent bénéficier de cette loi : <a href=`http://bit.ly/2xxMicY`>http://bit.ly/2xxMicY</a>'}"></ng-container>

12 Add/Remove Event Listeners
	Don't use an anonymous function, instead name the function and put the removal in the event handler.

	var func = function(event) {
	   transitionComplete( event.propertyName );
		e.removeEventListener('transitionend',func);
	};

	e.addEventListener('transitionend',func, false);

13: Detecting Storage Support
function localStorageSupported() {
 try {
  return "localStorage" in window && window["localStorage"] !== null;
 } catch (e) {
  return false;
 }
}

14 : Angular CLI use YARN
	`ng set --global packageManager=yarn`

	ng set --global packageManager=npm

	yarn config set yarn-offline-mirror ~/npm-packages-offline-cache ( This will create a file .yarnrc in the user’s directory on your computer. )

	ng new hello-cli --skip-install

	cd hello-cli

	yarn install

	yarn cache clean

	ng new hello-cli2 --skip-install

	cd hello-cli2

	yarn install --offline

	----------------------------

	$ yarn global add create-react-app

	$ create-react-app my-app

15: ng serve --poll = 2000


16:Angular Tips: Avoiding duplication of RxJS operator imports (https://loiane.com/2017/08/angular-rxjs-imports/)

	Create file  : src/app/shared/rxjs-operators.ts - Below is how it looks like:
	// Observable class extensions
	import 'rxjs/add/observable/of';

	// Observable operators
	import 'rxjs/add/operator/map';
	import 'rxjs/add/operator/do';
	import 'rxjs/add/operator/catch';
	import 'rxjs/add/operator/switchMap';
	import 'rxjs/add/operator/mergeMap';
	import 'rxjs/add/operator/filter';
	import 'rxjs/add/operator/debounceTime';
	import 'rxjs/add/operator/distinctUntilChanged';

	You can import it directly in you app.module:
	import './rxjs-operators';

	C:\jr\ui-core-widget\src\components\al-popover\al-popover.component.ts
		import { Observable } from 'rxjs/Observable';
		import { BehaviorSubject } from 'rxjs/BehaviorSubject';
		import { Subject } from 'rxjs/Subject';
		import { Subscription } from 'rxjs/Subscription';

		import 'rxjs/add/observable/timer';
		import 'rxjs/add/observable/fromEvent';
		import 'rxjs/add/operator/skipUntil';
		import 'rxjs/add/operator/filter';
		import 'rxjs/add/operator/take';

17 : Updating Angular CLI

	If you're using Angular CLI 1.0.0-beta.28 or less, you need to uninstall angular-cli package. It should be done due to changing of package's name and scope from angular-cli to @angular/cli:

	npm uninstall -g angular-cli
	npm uninstall --save-dev angular-cli
	To update Angular CLI to a new version, you must update both the global package and your project's local package.

	Global package:

	npm uninstall -g @angular/cli
	npm cache verify
	# if npm version is < 5 then use `npm cache clean`
	npm install -g @angular/cli@latest
	Local project package:

	rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
	npm install --save-dev @angular/cli@latest
	npm install

18. Angular CLI commands

	ng new [name] --minimal

	ng new [name] --inline-template

	ng new [name] --inline-style

	ng new [name] --style=scss

	ng new [name] --routing

	ng generate component second

	ng new [name] --skip-git

	ng new [name] --skip-install

19: Stackblitz

	https://stackblitz.com/github/gothinkster/angular-realworld-example-app?file=src%2Fapp%2Fsettings%2Fsettings.module.ts

	You can run any public repo on Github by providing the username + repo name like so:

	stackblitz.com/github/{GH_USERNAME}/{REPO_NAME}

	And you can also optionally specify a branch, tag, or commit:

	.../github/{GH_USERNAME}/{REPO_NAME}/tree/{TAG|BRANCH|COMMIT}

20: Create React App

	$ create-react-app hello-world
	(...tons of output)
	Success! Created hello-world at /Users/brandon/Documents/dev/create-react-app/hello-world
	Inside that directory, you can run several commands:
	yarn start
		Starts the development server.
	yarn run build
		Bundles the app into static files for production.
	yarn test
		Starts the test runner.
	yarn run eject
		Removes this tool and copies build dependencies, configuration files
		and scripts into the app directory. If you do this, you can’t go back!
	We suggest that you begin by typing:
	cd hello-world
	  yarn start
	Happy hacking!

21 : Setup Vue.js

yarn add vue vuex vue-router vuex-router-sync @vue/cli vue-cli

22 : .npmrc

registry=https://registry.npmjs.org/
strict-ssl=false
tmp=C:\jr\Temp
/uicore:assetspath=http://localhost:7575

23: Comemu
-cur_console:b -cur_console:d:C:\jr\base-app -cur_console:t:"Base App" cmd.exe /k "%ConEmuBaseDir%\CmdInit.cmd" -run cd..

> -cur_console:f -cur_console:d:C:\jr\style-guide-app-linked -cur_console:t:"Styleguide App" cmd.exe /k "%ConEmuBaseDir%\CmdInit.cmd" -run cd..

-cur_console:d:C:\Users\<UserName>\Documents\GitHub\react-todo-app -cur_console:t:ReactTodo-Server cmd.exe /k call npm start

> -cur_console:d:C:\Users\<UserName>\Documents\GitHub\react-todo-app -cur_console:t:ReactTodo-Webpack "C:\WINDOWS\system32\cmd.exe"   /k call npm run webpack

24: The browser is sending an OPTIONS (preflight) request because whatever code that's making the request isn't satisfying the requirements to avoid a preflight request. See here:
https://stackoverflow.com/questions/42168773/how-to-resolve-preflight-is-invalid-redirect-in-cors

Basically,

The http method must be GET, HEAD, or POST
The only headers you can set are Accept, Accept-Language, Content-Language, Content-Type, DPR, Downlink, Save-Data, Viewport-Width, or Width
The Content-Type request header must be application/x-www-form-urlencoded, multipart/form-data, or text/plain
Resource Override can change request headers, although in this case, chrome seems to filter out the request automatically (probably so extensions can't change them because it's a security issue). If you need to use certain headers or an uncommon http method then I'm not sure there's much you can do. I suppose you could redirect the script that's causing the request to your own script so you can just make the request to the correct url from the beginning.

Let me know if you find a way around this, as odds don't look too good for a solution.

25. Angular 5 webpack bundle analyzer
Angular Optimization:

	Testing of Code analyzation of Modules and Bundle files to reduce bundle size
	install "webpack-bundle-analyzer" globally : https://github.com/webpack-contrib/webpack-bundle-analyzer
	add this in package.json file : "bundle-report": "webpack-bundle-analyzer dist/stats.json" in base app
	"ng build --prod --stats-json" in base app ( // Above command builds our application in prod mode and also,
	// generates stats.json, and stores it in /dist/stats.json)
	run "npm run bundle-report" or webpack-bundle-analyzer dist/stats.json

26 How to import .JSON file in Angular and Typescript
// Method 1 : Using import ( Using Wildcard Module Name )
// Source : https://hackernoon.com/import-json-into-typescript-8d465beded79
/* First Add following in typings.d.ts
declare module "*.json" {
    const value: any;
    export default value;
}

Then, your code will work like charm!

// Typescript
// app.ts
import * as data from './example.json';
const word = (<any>data).name;
console.log(word); // output 'testing'
*/

## Error : Uncaught Error: Unexpected value '[object Object]' imported by the module 'CoreModule'. Please add a @NgModule annotation.
    at syntaxError (compiler.es5.js:1694)
    at compiler.es5.js:15398

Uncaught Error: Unexpected value '[object Object]' imported by the module 'AppModule'. Please add a @NgModule annotation. to Uncaught Error: Unexpected value '[object Object]' imported by the module 'AppModule'. Please add a @NgModule annotation.

```
I had the same issue, found answer here: https://github.com/angular/angular-cli/wiki/stories-linked-library

You need to edit /src/tsconfig.app.json in your project (not library!) and add:

    "baseUrl": "",
    "paths": {
      "@angular/*": [
        "../node_modules/@angular/*"
      ]
    },

into compilerOptions object.

ng serve --preserve-symlinks
```

## NPM dependencies

Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.

Please do not put test harnesses or transpilers in your dependencies object. See devDependencies, below.

See semver for more details about specifying version ranges.

- version Must match version exactly
- &gt;version Must be greater than version
- &gt;=version etc
- &lt;version
- &lt;=version
- ~version "Approximately equivalent to version" See semver
- ^version "Compatible with version" See semver
- 1.2.x 1.2.0, 1.2.1, etc., but not 1.3.0
- http://... See 'URLs as Dependencies' below
- * Matches any version
- "" (just an empty string) Same as *
- version1 - version2 Same as >=version1 <=version2.
- range1 || range2 Passes if either range1 or range2 are satisfied.
- git... See 'Git URLs as Dependencies' below
- user/repo See 'GitHub URLs' below
- tag A specific version tagged and published as tag See npm-dist-tag
- path/path/path See Local Paths below

For example, these are all valid:

```
{ "dependencies" :
  { "foo" : "1.0.0 - 2.9999.9999"
  , "bar" : ">=1.0.2 <2.1.2"
  , "baz" : ">1.0.2 <=2.3.4"
  , "boo" : "2.0.1"
  , "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0"
  , "asd" : "http://asdf.com/asdf.tar.gz"
  , "til" : "~1.2"
  , "elf" : "~1.2.3"
  , "two" : "2.x"
  , "thr" : "3.3.x"
  , "lat" : "latest"
  , "dyl" : "file:../dyl"
  }
}
```

## Webpack common chunks in Angular CLI

```
// ng eject will eject webpack.config.js for more customization
// webpack.config.js

// const entryPoints = ["inline","polyfills","sw-register","styles","vendor","main","rxjs", "alight"];
const entryPoints = ["inline", "polyfills", "rxjs", "angular", "lodash", "sw-register", "styles", "primeng", "vendor", "main"];

"plugins": [
	new CommonsChunkPlugin({
		"name": [
			"rxjs"
		],
		"minChunks": (module) => {
			console.log('RXJS :::', module.resource, '====', module.resource && module.resource.startsWith(nodeModules + '\\rxjs'));

			return module.resource
			&& (module.resource.startsWith(nodeModules+ '\\rxjs'));
		},
		"chunks": [
			"main"
		]
	}),
	new CommonsChunkPlugin({
      "name": [
        "lodash"
      ],
      "minChunks": (module) => {
        console.log('lodash :::', module.resource, '====', module.resource && module.resource.startsWith(nodeModules + '\\lodash'));

        return module.resource
          && (module.resource.startsWith(nodeModules + '\\lodash') || module.resource.startsWith(nodeModules + '\\ng2-validation'));
      },
      "chunks": [
        "main"
      ]
    }),
	 new CommonsChunkPlugin({
      "name": [
        "angular"
      ],
      "minChunks": (module) => {
        console.log('@angular :::', module.resource, '====', module.resource && module.resource.startsWith(nodeModules + '\\@angular'));

        return module.resource
          && (module.resource.startsWith(nodeModules + '\\@angular'));
      },
      "chunks": [
        "main"
      ]
    }),
    new CommonsChunkPlugin({
		"name": [
			"vendor"
		],
		"minChunks": (module) => {
			console.log('module.resource :::', module.resource)
			console.log("nodeModules ::: ================", module.resource && module.resource.startsWith(nodeModules));
			console.log("genDirNodeModules ::: ================", module.resource && module.resource.startsWith(genDirNodeModules));
			console.log("realNodeModules ::: ================", module.resource && module.resource.startsWith(realNodeModules));

			/* output
			=========================
				module.resource ::: C:\my-sample-angular-app\node_modules\primeng\components\button\button.js
				nodeModules ::: ================ C:\my-sample-angular-app\node_modules
				genDirNodeModules ::: ================ C:\my-sample-angular-app\src\$$_gendir\node_modules
				realNodeModules ::: ================ C:\my-sample-angular-app\node_modules
			*/

			return module.resource
			&& (module.resource.startsWith(nodeModules)
			|| module.resource.startsWith(genDirNodeModules)
			|| module.resource.startsWith(realNodeModules));
		},
		"chunks": [
			"main"
		]
	})
}

// Index.html
&lt;script type="text/javascript" src="./inline.bundle.js">&lt;/script>
&lt;script type="text/javascript" src="./polyfills.bundle.js">&lt;/script>
&lt;script type="text/javascript" src="./rxjs.bundle.js">&lt;/script>
&lt;script type="text/javascript" src="./styles.bundle.js">&lt;/script>
&lt;script type="text/javascript" src="./vendor.bundle.js">&lt;/script>
&lt;script type="text/javascript" src="./main.bundle.js">&lt;/script>

```

## Split app and vendors

When your application is depending on other libraries, especially large ones like Angular JS, you should consider splitting those dependencies into its own vendors bundle. This will allow you to do updates to your application, without requiring the users to download the vendors bundle again. Use this strategy when:

- When your vendors reaches a certain percentage of your total app bundle. Like 20% and up
- You will do quite a few updates to your application
- You are not too concerned about perceived initial loading time, but you do have returning users and care about optimizing the experience when you do updates to the application
- Users are on mobile

```
webpack.production.config.js

var path = require('path');
var webpack = require('webpack');
var nodeModulesDir = path.resolve(__dirname, '../node_modules');

var config = {
  entry: {
    app: path.resolve(__dirname, '../app/main.js'),
    vendors: ['angular'] // And other vendors
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: [nodeModulesDir],
      loader: 'babel'
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
};

module.exports = config;
```

This configuration will create two files in the dist/ folder. app.js and vendors.js.

> **Important!**
Remember to add both files to your HTML file, or you will get the error: Uncaught ReferenceError: webpackJsonp is not defined.


## Angular CLI : eject webpack.config.js for local development and production build

### Example 1

Source : <a href="https://github.com/dmachat/angular-webpack-cookbook/wiki/Split-app-and-vendors">Split app and vendors</a>

You can eject the production version of the webpack config by using the following command:

`ng eject --prod`

If you want to use both the development & production versions of the ejected webpack config, do the following:

Backup your existing package.json
Execute ng eject --prod (this will eject the production version of webpack config)

Rename the ejected webpack.config.json to webpack.config-prod.json

Restore your backed up package.json (the actual changes are pretty much the scripts and few new packages). You might also want to edit your .angular-cli.json and change the ejected property to false.
Execute ng eject (this will eject the development version).
You're now left with a production & development version of your webpack configs. Now, to compile your Angular project for production, execute webpack --config webpack.config-prod.js and you can also add this to your package.json scripts for ease.

However, this may not be the perfect method for this but this is what I did in the. If there's a better version, feel free to edit.

### Example 2

I ran into this issue after running ng eject and found this issue. It isn't very difficult to work around, just more hassle than it should be and shouldn't require a workaround at all.

IMHO running ng eject should spit out a webpack.dev.config and a webpack.prod.config. It should also create npm scripts for build:prod, and watch, in addition to the other scripts it creates.

So until an official solution presents itself, here's my workaround.

- run ng eject
- rename webpack.config.js to webpack.dev.config.js
- delete all the npm scripts in package.json
- run ng eject --prod
- (optional) rename the new webpack.config.js to webpack.prod.config.js
- setup your npm scripts in package.json
- run npm i
- And here is what my npm scripts look like when I'm done.

```
"scripts": {
    "build": "webpack --config webpack.dev.config",
    "watch": "webpack --watch --config webpack.dev.config",
    "build:prod": "webpack --config webpack.prod.config",
    "start": "webpack-dev-server --port=4200 --config webpack.dev.config",
    "test": "karma start ./karma.conf.js",
    "pree2e": "webdriver-manager update --standalone false --gecko false --quiet",
    "e2e": "protractor ./protractor.conf.js"
  }
  ```

## Webpack code splitting

Source : <a href="http://www.syntaxsuccess.com/viewarticle/code-splitting-in-webpack"></a>

```
var path = require('path');
const webpack = require('webpack');

module.exports = {
	entry : {
		person: './src/code-splitting-webpack/person-service.js',
		car: './src/code-splitting-webpack/car-service.js'
	},
	devtool: "source-map",
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '../../dist')
	},
  	output: {
        path: root('dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js',
        pathinfo: true
	},
	resolve: {
		extensions: ['', '.ts', '.js', '.json', '.css', '.html']
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'lib',
			minChunks: 2,
			filename: '[name].js',
		})
	]
}
```

## Webpack config file examples

### Example 1

Soruce : [Vendor and code splitting in webpack 2](https://medium.com/@adamrackis/vendor-and-code-splitting-in-webpack-2-6376358f1923)
```
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './reactStartup.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'simple-react-bootstrap': 'node_modules/simple-react-bootstrap/dist/simple-react-bootstrap.js',
            'jscolor': 'util/jscolor.js'
        },
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};
```

```
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './reactStartup.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'simple-react-bootstrap': 'node_modules/simple-react-bootstrap/dist/simple-react-bootstrap.js',
            'jscolor': 'util/jscolor.js'
        },
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'node-static',
            filename: 'node-static.js',
            minChunks(module, count) {
                var context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            },
        }),
    ]
};
```

## Our solution for getting a previous route with Angular 5

REf : https://blog.hackages.io/our-solution-to-get-a-previous-route-with-angular-5-601c16621cf0

```
// SERVICE

@Injectable()
export class RoutingState {
  private history = [];

  constructor(
    private router: Router
  ) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || '/index';
  }
}

// USAGE

@Component(...)
export class OurComponent implements OnInit {
  previousRoute: string;

  constructor(
    private routingState: RoutingState
  ) {}

  ngOnInit() {
    this.previousRoute = this.routingState.getPreviousUrl();
  }

}
```

## Angular 4 `ng-content`
```html
<!-- card.component.html -->
<div class="card">
    <div class="card-header">
        {{ header }}
    </div>

    <!-- add the select attribute to ng-content -->
    <ng-content select="[card-body]"></ng-content>

    <div class="card-footer">
        {{ footer }}
    </div>
</div>

<!-- app.component.html -->

<h1>Single slot transclusion</h1>
<card header="my header" footer="my footer">

    <div class="card-block" card-body><!--  We add the card-body attribute here -->
        <h4 class="card-title">You can put any content here</h4>
        <p class="card-text">For example this line of text and</p>
        <a href="#" class="btn btn-primary">This button</a>
      </div>

<card>
```
Notice that we add select=[card-body]. The square bracket [] means attribute. It means "Replace me only if the element has card-body attribute".

Then, we change our app component view to include the card-body attribute.

### Using Attribute with Value

```
<ng-content select="[card-type=body]"></ng-content>

<div class="card-block" card-type="body">...<div>

```

### Using CSS Class Selector

```
<ng-content select=".card-body"></ng-content>

<div class="card-block card-body">...</div>

```

### Using Multiple Attributes or CSS Classes

You can define more than one attribute or CSS Classes:

Atttributes: [card][body]
Classes: .card.body

Here is the example of multiple attributes

```
<ng-content select="[card][body]"></ng-content>

<div class="card-block" body card>...</div>
```

### Using an HTML Tag
```
<ng-content select="card-body"></ng-content>

<card-body class="card-block">...<card-body>
```





## Angular Errors
`ERROR in Metadata version mismatch for module C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacycreatehelprequestwidget/node_modules/primeng/components/dropdown/dropdown.d.ts, found version 4, expected 3, resolving symbol AdvocacyCreateHelpRequestWidgetModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacycreatehelprequestwidget/src/index.ts, resolving symbol AdvocacyCreateHelpRequestWidgetModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app-linked/node_modules/@alight/advocacycreatehelprequestwidget/src/index.ts`

```
ERROR in Error encountered resolving symbol values statically. Calling function 'AdvocacyCreateHelpRequestWidgetModule', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol CoreModule in /home/me/UPN/upoint-base-app/src/app/app.module.ts, resolving symbol CoreModule in /home/me/UPN/upoint-base-app/src/app/app.module.ts

// Fixed by changing name in tsconfig.es5.json

"angularCompilerOptions": {
    "annotateForClosureCompiler": true,
    "strictMetadataEmit": true,
    "skipTemplateCodegen": true,
    "flatModuleOutFile": "advocacycreatehelprequestwidget.js",
    "flatModuleId": "@alight/advocacycreatehelprequestwidget"
  },
```
--------------------------------------
ng build --app 0 --prod --aot



ERROR in Type AppComponent in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.component.ts is part of the declarations
of 2 modules: CoreModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.module.qa.ts and CoreModule in C:/jr/__UP
ointNext/NextGen-v3/upoint-base-app/src/app/app.module.ts! Please consider moving AppComponent in C:/jr/__UPointNext/NextGen-v3/
upoint-base-app/src/app/app.component.ts to a higher module that imports CoreModule in C:/jr/__UPointNext/NextGen-v3/upoint-base
-app/src/app/app.module.qa.ts and CoreModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.module.ts. You can als
o create a new NgModule that exports and includes AppComponent in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.comp
onent.ts then import that NgModule in CoreModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.module.qa.ts and C
oreModule in C:/jr/__UPointNext/NextGen-v3/upoint-base-app/src/app/app.module.ts.
ERROR in ./src/main.ts
Module not found: Error: Can't resolve './$$_gendir/app/app.module.ngfactory' in 'C:\jr\__UPointNext\NextGen-v3\upoint-base-app\
src'
resolve './$$_gendir/app/app.module.ngfactory' in 'C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src'
using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src)
Field 'browser' doesn't contain a valid alias configuration
after using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src)
using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src/$$_gendir/app/app.m
odule.ngfactory)
no extension
Field 'browser' doesn't contain a valid alias configuration
C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory doesn't exist
.ts
Field 'browser' doesn't contain a valid alias configuration
C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory.ts doesn't exist
.js
Field 'browser' doesn't contain a valid alias configuration
C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory.js doesn't exist
as directory
C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory doesn't exist
[C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory]
[C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory.ts]
[C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory.js]
[C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src\$$_gendir\app\app.module.ngfactory]
@ ./src/main.ts 6:0-75
@ multi ./src/main.ts


-------------------------------------------------------

ERROR in Error encountered resolving symbol values statically. Calling function 'AdvocacyChannelsModule', function calls are not su
pported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol CoreModule in C:/jr/_
_UPointNext/NextGen-v3/upoint-base-app/src/app-qa/app.module.ts, resolving symbol CoreModule in C:/jr/__UPointNext/NextGen-v3/upoin
t-base-app/src/app-qa/app.module.ts
ERROR in ./src/main.ts
Module not found: Error: Can't resolve './$$_gendir/app/app.module.ngfactory' in 'C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src
'
resolve './$$_gendir/app/app.module.ngfactory' in 'C:\jr\__UPointNext\NextGen-v3\upoint-base-app\src'
using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src)
Field 'browser' doesn't contain a valid alias configuration
after using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src)
using description file: C:\jr\__UPointNext\NextGen-v3\upoint-base-app\package.json (relative path: ./src/$$_gendir/app/app.modu
le.ngfactory)

Resolved : Changed order or imported components in index.ts , updated name as per widget name in tsconfig.es5.json


Another solution : (https://stackoverflow.com/questions/46035031/angular2-error-in-error-encountered-resolving-symbol-values-statically)
Alright, after hours of reading I found one useful solution here https://github.com/angular/angular-cli/issues/3854#issuecomment-274344771

to be specific, add paths: { "@angular/*": ["../node_modules/@angular/*"] } to tsconfig.json file, "compilerOptions" option

It solves my problem but still wanna know why.
-------------------------------------
Error in base app build after installing AdvocacyChannelsModule widget

ERROR in vendor.bundle.js from UglifyJs
Unexpected token: name (mockConfig) [vendor.bundle.js:59484,12]

## Helpful Links of Tutorials

[Angular CLI and OS Environment Variables](https://medium.com/@natchiketa/angular-cli-and-os-environment-variables-4cfa3b849659)

[Angular Tips: Dynamic Module Imports with the Angular CLI](https://coryrylan.com/blog/angular-tips-dynamic-module-imports-with-the-angular-cli)

[Best-practices learnt from delivering a quality Angular4 application](https://hackernoon.com/best-practices-learnt-from-delivering-a-quality-angular4-application-2cd074ea53b3)
