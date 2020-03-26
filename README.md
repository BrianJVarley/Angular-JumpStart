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

### RxJS Operators and Examples

> **forkjoin**: Use `forkJoin` to join multiple Observable responses into a single Observable array.

```JavaScript

getCharactersAndPlanets() {
    return forkJoin(
      this.getCharacters(),
      this.getPlanets()
    )
    .pipe(
      map((res) => {
        return { characters: res[0], planets: res[1] };
      }),
      catchError(error => of(error))
    );
  }

```

> **mergeMap**: Use `switchMap` to switch to another Observable request.
> Then use `mergeMap` to merge or flatten custom data into that Observable response.
> Finally call `toArray` to return an Observable array.

```JavaScript

getCharactersAndHomeworlds() {
    return this.http.get(this.baseUrl + 'people')
      .pipe(
        switchMap(res => {
          // convert array to observable
          return from(res['results']);
        }),
        mergeMap((person: any) => {
            return this.http.get(person['homeworld'])
              .pipe(
                map(hw => {
                  person['homeworld'] = hw;
                  return person;
                })
              );
        }),
        toArray()
      );
  }

```

> **switchMap**: Use `switchMap` to return Observable response and _switch_
> to another Observable.

```JavaScript


  getCharacterAndHomeworld() {
    const url = this.baseUrl + 'people/1';
    return this.http.get(url)
      .pipe(
        switchMap(character => {
          return this.http.get(character['homeworld'])
            .pipe(
              map(hw => {
                character['homeworld'] = hw;
                return character;
              })
            )
        })
      );
  }

```

## Other Angular Code Examples

> **Example:** Lazy loading modules at runtime in the `Routes` declaration via `loadChildren` prop.

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

> **Example:** Preventing CoreModules (Singletons / Single Use Components) from being reimported outside of `AppModule`.
> For example you don't want to re-import a root level toast component or logger service twice in the same app.

```JavaScript

export class OverlayModule extends EnsureModuleLoadedOnceGuard {    // Ensure that OverlayModule is only loaded into AppModule

  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: OverlayModule) {
    super(parentModule);
  }
}

```

> **Example:** Guarding against Presentation (Child)Components from changing data within a Container(Parent). In a Container -> Presenation model we only want the Container to provide or modify the data. So you can use `ChangeDetectionStrategy.OnPush` strategy within the presentational component.

```JavaScript

@Component({
  selector: 'cm-customers-card',
  templateUrl: './customers-card.component.html',
  styleUrls: [ './customers-card.component.css' ],
  // When using OnPush detectors, then the framework will check an OnPush
  // component when any of its input properties changes, when it fires
  // an event, or when an observable fires an event ~ Victor Savkin (Angular Team)
  changeDetection: ChangeDetectionStrategy.OnPush
})

```

> **Example:** TL;DR; Don't use functions or methods in the template, use pipes instead.
> A pipe would be called only when input values change. A function or a method would be called on every change detection.
> Because the transform function of the `pipe` only gets called if the inputs are different.
>
> You can further improve the performance of the pipe by caching results with the `@memo` decorator

```JavaScript

import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'addtaxmemo'
})
export class AddTaxMemoPipe implements PipeTransform {
  @memo()
  transform(price: number): number {
    if (price) {
      return this.getTotalPrice(price);
    }
    return price;
  }

  getTotalPrice(price: number) {
    console.log('addtaxmemo pipe called');
    let total = price + (price * .08);
    return total;
  }

}

```

> **Example:** Cloning reference type like Object and Arrays so ngChange still fires.
> In this case we can use `import { List, Map, fromJS } from 'immutable';` Example usage of `immutable` to cast as immutable object..

```JavaScript
import { Injectable } from '@angular/core';
import { Customer } from '../shared/interfaces';
import { List, Map, fromJS } from 'immutable';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ClonerService } from './cloner.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  customers: Customer[] = [
    {
      id: 1,
      name: 'John Doe',
      address: {
        city: 'Phoenix'
      },
      orderTotal: 9.99
    }
  ];

  immutableCustomers = List<Customer>(this.customers);

  constructor(private clonerService: ClonerService) {  }

  getCustomers() : Observable<Customer[]> {
    // const custs = this.customers;
    // const custs = JSON.parse(JSON.stringify(this.customers));
    // const custs = this.clonerService.deepClone<Customer[]>(this.customers);
    const custs = this.immutableCustomers.toArray();
    return of(custs);
  }

  getCustomer(id: number) : Observable<Customer> {
    return this.getCustomers()
      .pipe(
        map(custs => {
          const filteredCusts = custs.filter(cust => cust.id === id);
          // Enable if using Immutable.js below
          // const filteredCusts = this.immutableCustomers.filter(cust => cust.id === id);
          if (filteredCusts) {
            const cust = filteredCusts[0];
            // return cust;
            // return JSON.parse(JSON.stringify(cust)) as Customer;
            //return this.clonerService.deepClone<Customer>(cust);
            return fromJS(cust).toJS() as Customer;
          }
        }),
      );
  }

  updateCustomer(customer: Customer) : Observable<boolean> {
    const index = this.getCustomerIndex(customer.id);
    customer.orderTotal = +customer.orderTotal;
    // update collections
    this.customers[index] = customer;
    this.immutableCustomers = this.immutableCustomers.update(index, () => customer);
    return of(true);
  }

  getCustomerIndex(id: number) {
    return this.customers.findIndex((cust, index, array) => cust.id === id);
  }

}


```

> **Example:** Unsubscribing from Observable subscriptions in Angular
> using s Decorator.

```JavaScript

// Decorator Function
function AutoUnsub() {
    return function(constructor) {
        const orig = constructor.prototype.ngOnDestroy
        constructor.prototype.ngOnDestroy = function() {
            for(const prop in this) {
                const property = this[prop]
                if(typeof property.subscribe === "function") {
                    property.unsubscribe()
                }
            }
            orig.apply()
        }
    }
}
```

```JavaScript

@Component({
    ...
})

// AutoUnsub usage
@AutoUnsub
export class AppComponent implements OnInit {
    observable$
    ngOnInit () {
        this.observable$ = Rx.Observable.interval(1000);
        this.observable$.subscribe(x => console.log(x))
    }
}
```

> **Example:** Inheriting from a Base Component to reduce duplicate @input, @output plumbing code in components.

```JavaScript

// The BaseComponent

import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-base-component',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseComponent implements OnInit, OnChanges {
  @Input() label: string;

  private _value: string;
  @Input() get value() {
      return this._value;
  }
  set value(val: string) {
      if (val && val !== this._value) {
        this.isDirty = true;
      }
      this._value = val;
      this.valueChange.emit(val);
  }

  @Input() isDirty = false;
  @Output() valueChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      console.log('Value changed ', changes['value'].currentValue);
    }
  }

}

// The Component Inheriting from BaseComponent

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-widget1',
  templateUrl: './widget1.component.html',
  styleUrls: ['./widget1.component.css']
})
export class Widget1Component extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}

```

> **Example:** Helper function to pipe Service Observable response to
> success and error actions in an effect.

```JavaScript

import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { DataServiceError } from '../services';

export abstract class DataAction<T> implements Action {
  readonly type: string;
  constructor(public readonly payload: T) {}
}

export abstract class DataErrorAction<T> implements Action {
  readonly type: string;
  constructor(public readonly payload: DataServiceError<T>) {}
}

// Function of additional success actions
// that returns a function that returns
// an observable of ngrx action(s) from DataService method observable
export const toAction = (...actions: Action[]) => <T>(
  source: Observable<T>,
  successAction: new (data: T) => Action,
  errorAction: new (err: DataServiceError<T>) => Action
) =>
  source.pipe(
    mergeMap((data: T) => [new successAction(data), ...actions]),
    catchError((err: DataServiceError<T>) => of(new errorAction(err)))
  );



```

```JavaScript
 // Example usage within an effect calling a service

  @Effect()
  getCustomers$: Observable<Action> = this.actions$
    .pipe(
      ofType(CustomerActions.GET_CUSTOMERS),
      switchMap(() =>
        toAction(
          this.customerDataService.getCustomers(),
          CustomerActions.GetCustomersSuccess,
          CustomerActions.GetCustomersError
        )
      )
    );


```

> **Example:** Using an Observable Store without using NgRx or another state management

```JavaScript

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ObservableStore } from '@codewithdan/observable-store';

import { Customer } from '../core/model';
import { StoreState } from '../shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CustomersService extends ObservableStore<StoreState> {

    apiUrl = 'api/customers';

    constructor(private http: HttpClient) {
        super({ trackStateHistory: true });
    }

    private fetchCustomers() {
        return this.http.get<Customer[]>(this.apiUrl)
            .pipe(
                map(customers => {
                    this.setState({ customers }, CustomersStoreActions.GetCustomers);
                    return customers;
                }),
                catchError(this.handleError)
            );
    }

    getAll() {
        const state = this.getState();
        // pull from store cache
        if (state && state.customers) {
            console.log(this.stateHistory);
            return of(state.customers);
        }
        // doesn't exist in store so fetch from server
        else {
            return this.fetchCustomers()
                .pipe(
                    catchError(this.handleError)
                );
        }
    }

    get(id) {
        return this.getAll()
            .pipe(
                map(custs => {
                    let filteredCusts = custs.filter(cust => cust.id === id);
                    const customer = (filteredCusts && filteredCusts.length) ? filteredCusts[0] : null;
                    this.setState({ customer }, CustomersStoreActions.GetCustomer);
                    return customer;
                }),
                catchError(this.handleError)
            );
    }

    add(customer: Customer) {
        return this.http.post(this.apiUrl, customer)
            .pipe(
                switchMap(cust => {
                    // update local store with added customer data
                    // not required of course unless the store cache is needed
                    // (it is for the customer list component in this example)
                    return this.fetchCustomers();
                }),
                catchError(this.handleError)
            );
    }

    update(customer: Customer) {
        return this.http.put(this.apiUrl + '/' + customer.id, customer)
            .pipe(
                switchMap(cust => {
                    // update local store with updated customer data
                    // not required of course unless the store cache is needed
                    // (it is for the customer list component in this example)
                    return this.fetchCustomers();
                }),
                catchError(this.handleError)
            );
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + '/' + id)
            .pipe(
                switchMap(() => {
                    // update local store since customer deleted
                    // not required of course unless the store cache is needed
                    // (it is for the customer list component in this example)
                    return this.fetchCustomers();
                }),
                catchError(this.handleError)
            );
    }

    private handleError(error: any) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            const errMessage = error.error.message;
            return Observable.throw(errMessage);
        }
        return Observable.throw(error || 'Server error');
      }
}

export enum CustomersStoreActions {
    GetCustomers = 'get_customers',
    GetCustomer = 'get_customer'
}

```

> **Example:** Mediator Pattern using an EventBus service to communicate between components

```JavaScript

// Component emitting to eventBus service
 constructor(private eventbus: EventBusService) { }

  selectCustomer(cust: Customer) {
    // Send customer to any eventbus listeners listening for the CustomerSelected event
    this.eventbus.emit(new EmitEvent(Events.CustomerSelected, cust));
  }

```

```JavaScript

// Component listening to the eventBus service event emit
constructor(private eventbus: EventBusService, private dataService: DataService) { }

  ngOnInit() {
    //Example of using an event bus to provide loosely coupled communication (mediator pattern)
    this.eventbusSub = this.eventbus.on(Events.CustomerSelected, (cust => this.customer = cust));
  }
```

> **Example:** Generating a shared library using Angular CLI. This can be later
> published as an NPM package for re-use in different projects. Useful to share generic components
> across projects. For example a Notification Dialog component.

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


## Security Considerations


### [Route Guards([https://link](https://medium.com/@ryanchenkie_40935/angular-authentication-using-route-guards-bf7a4ca13ae3))


### [CORS]([https://link](https://itnext.io/cors-understanding-it-practically-9c401ed818cd?gi=58e87dec6a6d))

