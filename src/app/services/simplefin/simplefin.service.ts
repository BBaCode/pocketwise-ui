import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SimplefinService {
  // behavior subject to be subscribed to by everyone
  simplefinDataStore: BehaviorSubject<any>;
  private accountsUrl = 'http://localhost:80/accounts';
  private store: {
    accounts: any;
  };

  private initialData = {
    accounts: [],
  };

  constructor(private http: HttpClient) {
    this.store = {
      accounts: null,
    };

    this.simplefinDataStore = new BehaviorSubject<any>(this.initialData);
  }

  getAccounts(): void {
    console.log('get accounts triggered in simplefin service');
    this.http.get(this.accountsUrl).subscribe(
      (data: any) => {
        this.store.accounts = data.accounts;
        this.updateConsumers();
      },
      (error) => {
        console.error('Failed to load accounts', error);
      }
    );
  }

  // when next is called, all subscribers get the new data
  updateConsumers() {
    this.simplefinDataStore.next({ ...this.store });
  }
}
