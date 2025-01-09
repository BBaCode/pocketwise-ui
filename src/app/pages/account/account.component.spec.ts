import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

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
    routerSpy = jasmine.createSpyObj('Router', ['navigate']); // Initialize the spy with methods to spy on

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

  it('should call navigateToTransaction', () => {
    const transactionUrl = '/1'; // Example URL
    component.navigateToTransaction(transactionUrl);
    expect(routerSpy.navigate).toHaveBeenCalled(); // Verify that the spy's navigate method is called with the correct argument
  });
});
