import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSharedLibComponent } from './example-shared-lib.component';

describe('ExampleSharedLibComponent', () => {
  let component: ExampleSharedLibComponent;
  let fixture: ComponentFixture<ExampleSharedLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleSharedLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleSharedLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
