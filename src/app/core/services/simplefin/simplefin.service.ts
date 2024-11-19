import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account, Transaction } from '../../models/account.model';
import { MOCK_TRANSACTIONS } from '../../mock/mock-transactions';
import { MOCK_ACCOUNTS } from '../../mock/mock-accounts';

@Injectable({
  providedIn: 'root',
})
export class SimplefinService {
  private useMockData = true; // Toggle this to use mock data
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

  constructor(private http: HttpClient) {
    this.store = {
      accounts: null,
      transactions: null,
    };

    this.simplefinDataStore = new BehaviorSubject<any>(this.initialData);
    this.getAccounts();
  }

  getAccounts(): void {
    if (this.useMockData) {
      console.log('Using mock accounts');
      this.store.accounts = MOCK_ACCOUNTS;
      this.updateConsumers();
    } else {
      console.log('Fetching accounts from API');
      this.http.get(`${this.apiUrl}/accounts`).subscribe(
        (data: any) => {
          this.store.accounts = data.accounts;
          this.updateConsumers();
        },
        (error) => {
          console.error('Failed to load accounts', error);
        }
      );
    }
  }

  getTransactionsForAccount(accountId: string): void {
    if (this.useMockData) {
      console.log(`Using mock transactions for account ${accountId}`);
      this.store.transactions = MOCK_TRANSACTIONS.filter(
        (transaction: Transaction) => transaction.accountId === accountId
      );
      this.updateConsumers();
    } else {
      console.log('Fetching transactions from API');
      this.http
        .post(
          `${this.apiUrl}/transactions`,
          { account: accountId },
          {
            headers: { 'Content-Type': 'application/json' },
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
    console.log('loading new accounts from simplefin into database');
    this.http.get(`${this.apiUrl}/new-accounts`).subscribe(
      () => {
        // need to add a CTA and real feedback
        console.log('successfully loaded new accounts');
      },
      (error) => {
        console.error('Failed to load accounts', error);
      }
    );
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
