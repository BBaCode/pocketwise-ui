import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpHandler,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockRoute = {
    snapshot: {
      paramMap: {
        get: (id: any) => {
          return '123';
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute }, // Mock ActivatedRoute
        { provide: Router, useValue: routerSpy },
        provideHttpClient(withFetch()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
