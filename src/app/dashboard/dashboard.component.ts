import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimplefinService } from '../services/simplefin/simplefin.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, TagModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$: Subscription;
  accountList: Account[] | null = null;
  accountsLoaded: boolean = false;
  networth: number = 0;

  //mocked for testing to not use my real accounts
  mockBalance: string = '100000.00';
  mockBalanceInt: number = parseInt(this.mockBalance);

  constructor(private sf: SimplefinService) {
    this.accounts$ = sf.simplefinDataStore.subscribe((data) => {
      this.accountList = data.accounts;
      this.generateNetWorth();
      this.accountsLoaded = true;
      console.log(this.accountList);
    });
  }

  ngOnInit(): void {
    this.sf.getAccounts();
  }

  ngOnDestroy(): void {
    this.accounts$.unsubscribe();
    this.accountsLoaded = false;
  }

  // private decideTagColor(availableBalance: number | string) {
  //   if (typeof availableBalance === 'string')
  //     availableBalance = parseInt(availableBalance);
  //   if (availableBalance > 0) {
  //     return { severity: 'primary', value: 'Bank' };
  //   } else return { severity: 'success', value: 'Credit Card' };
  // }

  decideTagColor(availableBalance: string | number) {
    if (availableBalance === '0.00') {
      return 'info';
    } else return 'success';
  }

  decideTagValue(availableBalance: string | number) {
    if (availableBalance === '0.00') {
      return 'Credit Card';
    } else return 'Bank';
  }

  formatDollarValue(value: string) {
    const number = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }

  generateNetWorth() {
    this.accountList?.forEach((account) => {
      this.networth += parseInt(account['available-balance']);
    });
  }

  getLast30DaysTimestamp() {
    // Get the current date and time
    const now = new Date();

    // Calculate the date 30 days ago
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Convert to Unix timestamp in seconds (since Simplefin might need it in seconds)
    return Math.floor(last30Days.getTime() / 1000);
  }
}
