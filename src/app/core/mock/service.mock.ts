import { Subject, BehaviorSubject } from 'rxjs';
import { UserStoreData } from '../models/user.model';

export const DataStoreServiceSpy: jasmine.SpyObj<any> = {
  mockObservable$: new Subject<void>().asObservable(),
  dataStore: new BehaviorSubject<UserStoreData>({
    user: {
      email: 'email@gmail.com',
      firstName: 'brian',
      lastName: 'last name',
    },
    error: null,
  }),
  getAccounts: jasmine.createSpy('getAccounts').and.callThrough(),
  getAllTransactions: jasmine.createSpy('getAllTransactions').and.callThrough(),
  updateTransactions: jasmine.createSpy('updateTransactions').and.callThrough(),
  loadUpdatedAccounts: jasmine
    .createSpy('loadUpdatedAccounts')
    .and.callThrough(),
};
