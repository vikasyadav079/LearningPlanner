import { TestBed, inject } from '@angular/core/testing';

import { ErrorViewMangeService } from './error-view-mange.service';

describe('ErrorViewMangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorViewMangeService]
    });
  });

  it('should be created', inject([ErrorViewMangeService], (service: ErrorViewMangeService) => {
    expect(service).toBeTruthy();
  }));
});
