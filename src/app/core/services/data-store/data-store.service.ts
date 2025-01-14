import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Account,
  DataStore,
  Transaction,
  TransactionToUpdate,
} from '../../models/account.model';
import { MOCK_TRANSACTIONS } from '../../mock/transactions.mock';
import { MOCK_ACCOUNTS } from '../../mock/accounts.mock';
import { AuthService } from '../auth/auth.service';
import { Budget, BudgetRequest } from '../../models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  // behavior subject to be subscribed to by everyone
  dataStore: BehaviorSubject<DataStore>;

  private useMockData = false; // Toggle this to use mock data
  private apiUrl = 'http://localhost:80';
  private store: {
    accounts: Array<Account> | null;
    transactions: Array<Transaction> | null;
    budgets: Array<Budget> | null;
  };

  private initialData = {
    accounts: [],
    transactions: [],
    budgets: [],
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    this.store = {
      accounts: null,
      transactions: null,
      budgets: null,
    };

    this.dataStore = new BehaviorSubject<any>(this.initialData);
    this.getAccounts();
  }

  async getAccounts(): Promise<void> {
    if (this.useMockData) {
      console.log('Using mock accounts');
      this.store.accounts = MOCK_ACCOUNTS;
      this.updateConsumers();
    } else {
      console.log('Fetching accounts from API');

      const token = await this.auth.getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log(headers);
      this.http.get(`${this.apiUrl}/accounts`, { headers: headers }).subscribe(
        (data: any) => {
          this.store.accounts = data;
          this.updateConsumers();
        },
        (error) => {
          console.error('Failed to load accounts', error);
        }
      );
    }
  }

  async getAllTransactions(): Promise<void> {
    if (this.useMockData) {
      this.store.transactions = MOCK_TRANSACTIONS;
      this.updateConsumers();
    } else {
      console.log('Fetching all transactions from API');
      const token = await this.auth.getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.http
        .get(`${this.apiUrl}/all-transactions`, {
          headers: headers,
        })
        .subscribe(
          (data: any) => {
            this.store.transactions = data;
            this.updateConsumers();
          },
          (error) => {
            console.error('Failed to load transactions', error);
          }
        );
    }
  }

  async updateTransactions(updatedTxns: TransactionToUpdate[]): Promise<void> {
    const token = await this.auth.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    this.http
      .put(
        `${this.apiUrl}/update-transactions`,
        { updatedTxns },
        {
          headers: headers,
        }
      )
      .subscribe(
        (data: any) => {
          this.store.transactions = data;
          this.updateConsumers();
          console.log(data);
        },
        (error) => {
          console.error('Failed to load transactions', error);
        }
      );
  }

  async loadUpdatedAccounts() {
    await this.auth.getAuthToken().then((token) => {
      if (token) {
        console.log('Loading new accounts from SimpleFIN into database');
        this.http
          .get(`${this.apiUrl}/account-data`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .toPromise()
          .then(
            () => {
              console.log('Successfully loaded new accounts');
              this.getAccounts();
              this.updateConsumers();
            },
            (error) => {
              console.error('Failed to load accounts', error);
              this.updateConsumers();
            }
          );
      } else {
        console.error('No auth token found. Cannot load new accounts.');
      }
    });
  }

  async addNewBudget(budgetRequest: BudgetRequest) {
    await this.auth.getAuthToken().then((token) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      if (token) {
        this.http
          .post(`${this.apiUrl}/new-budget`, budgetRequest, {
            headers: headers,
          })
          .toPromise()
          .then(
            (message) => {
              console.log(message);
              this.updateConsumers();
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }

  async getAllBudgets() {
    await this.auth.getAuthToken().then((token) => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      if (token) {
        this.http
          .post(
            `${this.apiUrl}/all-budgets`,
            {},
            {
              headers: headers,
            }
          )
          .subscribe(
            (data: any) => {
              this.store.budgets = data;
              this.updateConsumers();
            },
            (error) => {
              console.log(error);
            }
          );
      }
    });
  }

  // when next is called, all subscribers get the new data
  private updateConsumers() {
    this.dataStore.next({ ...this.store });
    console.log('updating consumers', this.dataStore);
  }
}
