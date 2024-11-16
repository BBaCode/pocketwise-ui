import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimplefinService } from '../services/simplefin/simplefin.service';
import { Account, DataStore, Transaction } from '../models/account.model';
import { TableModule } from 'primeng/table';
import { EtDatePipe } from '../pipes/et-date.pipe';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormatDollarPipe } from '../pipes/format-dollar.pipe';
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
  transactions$: Subscription;
  transactions: Transaction[] | null = null;
  transactionsLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private sf: SimplefinService) {
    this.transactions$ = this.sf.simplefinDataStore.subscribe(
      (data: DataStore) => {
        this.transactions = data.transactions;
        this.transactionsLoaded = true;
        this.account = data.accounts.find((acc) => acc.id === this.accountId);
      }
    );
  }

  ngOnInit(): void {
    console.log('ngoninit begins', this.transactionsLoaded);
    this.transactionsLoaded = false;
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.sf.getTransactionsForAccount(this.accountId);
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

  formatDollarValue(value: any) {
    const number = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      currencySign: 'standard',
      currency: 'USD',
      currencyDisplay: 'symbol',
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }
}
