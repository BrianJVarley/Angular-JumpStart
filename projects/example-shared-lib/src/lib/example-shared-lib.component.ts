import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-example-shared-lib',
  template: `
    <p>
      example-shared-lib works!
    </p>
  `,
  styles: []
})
export class ExampleSharedLibComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
