import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Account,
  DataStore,
  Transaction,
  TransactionToUpdate,
} from '../../models/account.model';
import { MOCK_TRANSACTIONS } from '../../mock/mock-transactions';
import { MOCK_ACCOUNTS } from '../../mock/mock-accounts';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataStoreService {
  private useMockData = false; // Toggle this to use mock data
  // behavior subject to be subscribed to by everyone
  dataStore: BehaviorSubject<DataStore>;
  private apiUrl = 'http://localhost:80';
  private store: {
    accounts: Array<Account> | null;
    transactions: Array<Transaction> | null;
  };

  private initialData = {
    accounts: [],
    transactions: [],
  };

  constructor(private http: HttpClient, private auth: AuthService) {
    this.store = {
      accounts: null,
      transactions: null,
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

  // Not currently using but may be changed in the future to be useful
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

  // when next is called, all subscribers get the new data
  private updateConsumers() {
    this.dataStore.next({ ...this.store });
    console.log('updating consumers', this.dataStore);
  }
}
