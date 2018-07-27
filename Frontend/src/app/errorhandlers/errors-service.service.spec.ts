import { TestBed, inject } from '@angular/core/testing';

import { ErrorsServiceService } from './errors-service.service';

describe('ErrorsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorsServiceService]
    });
  });

  it('should be created', inject([ErrorsServiceService], (service: ErrorsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
