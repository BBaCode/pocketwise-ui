import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account, Transaction } from '../../models/account.model';
import { MOCK_TRANSACTIONS } from '../../mock/mock-transactions';
import { MOCK_ACCOUNTS } from '../../mock/mock-accounts';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SimplefinService {
  private useMockData = false; // Toggle this to use mock data
  // behavior subject to be subscribed to by everyone
  simplefinDataStore: BehaviorSubject<any>;
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

    this.simplefinDataStore = new BehaviorSubject<any>(this.initialData);
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

  // only mocked at this point, need to add to backend
  getAllTransactions(): void {
    if (this.useMockData) {
      this.store.transactions = MOCK_TRANSACTIONS;
      this.updateConsumers();
    }
  }

  async getTransactionsForAccount(accountId: string): Promise<void> {
    if (this.useMockData) {
      console.log(`Using mock transactions for account ${accountId}`);
      this.store.transactions = MOCK_TRANSACTIONS.filter(
        (transaction: Transaction) => transaction.accountId === accountId
      );
      this.updateConsumers();
    } else {
      console.log('Fetching transactions from API');

      const token = await this.auth.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      this.http
        .post(
          `${this.apiUrl}/transactions`,
          { account: accountId },
          {
            headers: headers,
          }
        )
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

  loadNewAccounts(): void {
    this.auth.getAuthToken().then((token) => {
      if (token) {
        console.log('Loading new accounts from SimpleFIN into database');
        this.http
          .get(`${this.apiUrl}/new-accounts`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .subscribe(
            () => {
              console.log('Successfully loaded new accounts');
            },
            (error) => {
              console.error('Failed to load accounts', error);
            }
          );
      } else {
        console.error('No auth token found. Cannot load new accounts.');
      }
    });
  }

  clearTransactions(): void {
    this.store.transactions = null;
    this.updateConsumers();
    console.log('cleared transactions', this.simplefinDataStore);
  }

  // when next is called, all subscribers get the new data
  private updateConsumers() {
    this.simplefinDataStore.next({ ...this.store });
    console.log('updating consumers', this.simplefinDataStore);
  }
}
