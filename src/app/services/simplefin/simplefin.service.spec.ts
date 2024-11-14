import { TestBed } from '@angular/core/testing';

import { SimplefinService } from './simplefin.service';

describe('SimplefinService', () => {
  let service: SimplefinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimplefinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
