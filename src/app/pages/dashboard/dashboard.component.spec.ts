import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Account } from '../../core/models/account.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dataStoreServiceSpy: jasmine.SpyObj<DataStoreService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock DataStoreService
    const dataStoreMock = jasmine.createSpyObj('DataStoreService', [
      'dataStore',
      'getAccounts',
      'getAllTransactions',
      'loadUpdatedAccounts',
    ]);

    // Mock Router
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Simulated account data
    const mockAccounts: Account[] = [
      {
        id: '1',
        name: 'account',
        'balance-date': 23423535,
        'available-balance': '1000',
        balance: '1000.00',
        transactions: [],
        org: { name: 'Chase Bank' },
      },
      {
        id: '2',
        name: 'account',
        'balance-date': 23423535,
        'available-balance': '1000',
        balance: '2000.00',
        transactions: [],
        org: { name: 'American Express' },
      },
      {
        id: '3',
        name: 'account',
        'balance-date': 23423535,
        'available-balance': '1000',
        balance: '3000.00',
        transactions: [],
        org: { name: 'Wells Fargo Bank' },
      },
    ];

    // Mock dataStore observable
    dataStoreMock.dataStore = of({ accounts: mockAccounts });

    // Configure the TestBed
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DataStoreService, useValue: dataStoreMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    // Initialize fixture and component
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dataStoreServiceSpy = TestBed.inject(
      DataStoreService
    ) as jasmine.SpyObj<DataStoreService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getAccounts and getAllTransactions on ngOnInit', () => {
    expect(dataStoreServiceSpy.getAccounts).toHaveBeenCalled();
    expect(dataStoreServiceSpy.getAllTransactions).toHaveBeenCalled();
  });

  it('should load and process account data', () => {
    expect(component.accountList?.length).toBe(3);
    expect(component.netWorth).toBe(6000); // 1000 + 2000 + 3000
  });

  it('should decide correct tag color for account types', () => {
    expect(component.decideTagColor('Credit Card')).toBe('info');
    expect(component.decideTagColor('Bank')).toBe('success');
    expect(component.decideTagColor(undefined)).toBe('success');
  });

  it('should navigate to the account detail page', () => {
    component.navigateToAccount('1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/account', '1']);
  });

  it('should convert string to number', () => {
    const result = component.convertToNumber('1234.56');
    expect(result).toBe(1234.56);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.accounts$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.accounts$.unsubscribe).toHaveBeenCalled();
    expect(component.accountsLoaded).toBeFalse();
  });

  it('should refresh data', async () => {
    dataStoreServiceSpy.loadUpdatedAccounts.and.returnValue(Promise.resolve());
    await component.refreshData();
    expect(dataStoreServiceSpy.loadUpdatedAccounts).toHaveBeenCalled();
    expect(component.accountsLoaded).toBeFalse();
  });
});
