import { TestBed } from '@angular/core/testing';

import { ExampleSharedLibService } from './example-shared-lib.service';

describe('ExampleSharedLibService', () => {
  let service: ExampleSharedLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExampleSharedLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
