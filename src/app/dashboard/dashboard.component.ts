import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimplefinService } from '../services/simplefin/simplefin.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Account } from '../models/account.model';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TagModule,
    ProgressSpinnerModule,
    PanelModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$: Subscription;
  accountList: Account[] | null = null;
  accountsLoaded: boolean = false;
  netWorth: number = 0;

  //mocked for testing to not use my real accounts
  mockBalance: string = '100000.00';
  mockBalanceInt: number = parseInt(this.mockBalance);

  constructor(private sf: SimplefinService, private router: Router) {
    this.accounts$ = sf.simplefinDataStore.subscribe((data) => {
      this.accountList = data.accounts;
      this.sortAccountByType();
      this.generateNetWorth();
      this.accountsLoaded = true;
      console.log('db constructed, account list:', this.accountList);
    });
  }

  ngOnInit(): void {
    this.accountsLoaded = false;
    this.sf.getAccounts();
    console.log('db inited');
  }

  ngOnDestroy(): void {
    this.accounts$.unsubscribe();
    this.accountsLoaded = false;
    console.log('db destroyed');
  }

  decideTagColor(accountType: string | undefined) {
    if (accountType === 'Credit Card') {
      return 'info';
    } else return 'success';
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

  navigateToAccount(id: string) {
    this.router.navigate(['/account', id]);
  }

  convertToNumber(s: string) {
    return parseInt(s);
  }

  private generateNetWorth() {
    this.accountList?.forEach((account) => {
      this.netWorth += parseInt(account['available-balance']);
    });
  }

  private sortAccountByType() {
    this.accountList?.forEach((acc) => {
      if (acc.org.name.includes('Chase')) {
        acc['type'] = 'Credit Card';
      } else if (acc.org.name.includes('Bank')) {
        acc['type'] = 'Bank';
      }
    });
  }
}
