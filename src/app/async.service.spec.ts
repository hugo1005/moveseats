import { TestBed, inject } from '@angular/core/testing';

import { AsyncService } from './async.service';

describe('AsyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsyncService]
    });
  });

  it('should be created', inject([AsyncService], (service: AsyncService) => {
    expect(service).toBeTruthy();
  }));
});
