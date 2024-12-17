import { TestBed } from '@angular/core/testing';

import { DataStoreService } from './data-store.service';
import {
  HttpClient,
  HttpHandler,
  provideHttpClient,
} from '@angular/common/http';

describe('DataStoreService', () => {
  let service: DataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(DataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
