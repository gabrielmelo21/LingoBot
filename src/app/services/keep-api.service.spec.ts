import { TestBed } from '@angular/core/testing';

import { KeepAPIService } from './keep-api.service';

describe('KeepAPIService', () => {
  let service: KeepAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeepAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
