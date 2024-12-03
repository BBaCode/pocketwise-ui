import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import {
  Account,
  DataStore,
  Transaction,
} from '../../core/models/account.model';
import { TableModule } from 'primeng/table';
import { EtDatePipe } from '../../core/pipes/et-date.pipe';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Categories, ColorCategories } from './constants';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    TableModule,
    EtDatePipe,
    CardModule,
    CommonModule,
    AvatarModule,
    FormatDollarPipe,
    ProgressSpinnerModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit, OnDestroy {
  account: Account | undefined;
  accountId: string | null = null;
  transactions$: Subscription = new Subscription();
  transactions: Transaction[] | null = null;
  transactionsLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    console.log('ngoninit begins', this.transactionsLoaded);
    this.transactionsLoaded = false;
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.transactions$ = this.dataStoreService.dataStore.subscribe(
        (data: DataStore) => {
          this.account = data.accounts?.find(
            (acc) => acc.id === this.accountId
          );
          if (!this.transactions) this.refresh();
          this.transactions =
            data.transactions?.filter(
              (txn) => txn.account_id === this.accountId
            ) || null;
          this.transactionsLoaded = !!this.transactions;
        }
      );
    } else {
      console.error('Unable to get transactions for account', this.accountId);
    }
  }

  ngOnDestroy(): void {
    this.transactions$.unsubscribe();
    this.transactions = null;
    this.transactionsLoaded = false;
  }

  assignIcon(category: string) {
    return `fa-solid fa-${Categories[category]}`;
  }

  assignIconColor(category: string) {
    return { 'background-color': ColorCategories[category], color: '#1a2551' };
  }

  async refresh() {
    await this.dataStoreService.getAllTransactions();
  }
}
