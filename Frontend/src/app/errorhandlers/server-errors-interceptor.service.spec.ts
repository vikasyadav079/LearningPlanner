import { TestBed, inject } from '@angular/core/testing';

import { ServerErrorsInterceptorService } from './server-errors-interceptor.service';

describe('ServerErrorsInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerErrorsInterceptorService]
    });
  });

  it('should be created', inject([ServerErrorsInterceptorService], (service: ServerErrorsInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
