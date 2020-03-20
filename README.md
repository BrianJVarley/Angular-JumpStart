# Angular JumpStart with TypeScript

The goal of this jumpstart app is to provide
a simple way to get started with Angular 2+ while also showing several key Angular features. The sample
relies on the Angular CLI to build the application.

## Angular Concepts Covered

- TypeScript version that relies on classes and modules
- Modules are loaded with System.js
- Defining routes including child routes and lazy loaded routes
- Using Custom Components including custom input and output properties
- Using Custom Directives
- Using Custom Pipes
- Defining Properties and Using Events in Components/Directives
- Using the Http object for Ajax calls along with RxJS observables
- Working with Utility and Service classes (such as for sorting and Ajax calls)
- Using Angular databinding Syntax [], () and [()]
- Using template-driven and reactive forms functionality for capturing and validating data
- Optional: Webpack functionality is available for module loading and more (see below for details)
- Optional: Ahead-of-Time (AOT) functionality is available for a production build of the project (see below for details)

## Running the Application

1. Install the latest LTS version of Node.js from https://nodejs.org. _IMPORTANT: The server uses ES2015 features AND the Angular CLI so you need a current version of Node.js._

1. Run `npm install` to install app dependencies

1. Run `ng build --watch` to build and bundle the code

1. Run `npm start` in a separate terminal window to build the TypeScript, watch for changes and launch the web server

1. Go to http://localhost:8080 in your browser

Simply clone the project or download and extract the .zip to get started.

Once the app is running you can play around with editing customers after you login. Use any email address and any password that's at least 6 characters long (with 1 digit).

Here are a few screenshots from the app:

<img width="500" src="src/assets/images/screenshots/cards.png" border="0" />

<br /><br />

<img width="500" src="src/assets/images/screenshots/grid.png" border="0" />

<br /><br />

<img width="500" src="src/assets/images/screenshots/orders.png" border="0" />

<br /><br />

<img width="500" src="src/assets/images/screenshots/details.png" border="0" />

## Running Angular Playground

This application includes Angular Playground (http://www.angularplayground.it) which provides a great way to isolate components in a sandbox rather than loading the
entire application to see a given component. To run the playground run the following command:

`npm run playground`

Then open a browser and visit `http://localhost:4201` and follow the directions there (or visit their website for more information).

## Running in Kubernetes

1. Install Docker Desktop from https://www.docker.com/get-started
1. Start Docker and enable Kubernetes in the Docker Desktop preferences/settings
1. Run `docker-compose build` to create the images
1. Run `kubectl apply -f .k8s` to start Kubernetes
1. Visit `http://localhost`
1. Stop Kubernetes using `kubectl delete -f .k8s`

## Notes and Examples

- Lazy loading modules at runtime in the `Routes` declaration via `loadChildren` prop.

```JavaScript

const app_routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/customers' },
  { path: 'customers/:id', data: { preload: true }, loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
  { path: 'orders', data: { preload: true }, loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule) },
  { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '**', pathMatch: 'full', redirectTo: '/customers' } // catch any unfound routes and redirect to home page
];

```

- Preventing CoreModules (Singletons / Single Use Components) from being reimported outside of `AppModule`.

For example you don't want to re-import a root level toast component or logger service twice in the same app.

```JavaScript

export class OverlayModule extends EnsureModuleLoadedOnceGuard {    // Ensure that OverlayModule is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: OverlayModule) {
    super(parentModule);
  }
}

```

- Generating a shared library using Angular CLI.

```Bash
ng generate library example-shared-lib
ng build example-shared-lib. See [Creating Libraries](https://angular.io/guide/creating-libraries)
```

```JavaScript
import { myExport } from 'example-shared-lib';

```

```Bash
ng build example-shared-lib --prod
cd dist/example-shared-lib
npm publish

```