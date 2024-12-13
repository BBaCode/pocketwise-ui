import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { Account } from '../../core/models/account.model';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TagModule,
    ProgressSpinnerModule,
    PanelModule,
    FormatDollarPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$: Subscription;
  accountList: Account[] | null = null;
  accountsLoaded: boolean = false;
  netWorth: number = 0;
  serverError: string = '';

  //mocked for testing to not use my real accounts
  mockBalance: string = '100000.00';
  mockBalanceInt: number = parseFloat(this.mockBalance);

  constructor(
    private dataStoreService: DataStoreService,
    private router: Router
  ) {
    this.accounts$ = dataStoreService.dataStore.subscribe((data) => {
      console.log('server error when trying to get data', this.serverError);
      this.accountList = data.accounts;
      this.sortAccountByType();
      this.netWorth = 0;
      this.generateNetWorth();
      this.accountsLoaded = true;
      console.log('db constructed, account list:', this.accountList);
      // if (!this.accountList) {
      //   setTimeout(() => {
      //     this.serverError = 'Server is down, please try again later.';
      //     console.log(
      //       'server error after trying to get data',
      //       this.serverError
      //     );
      //   }, 10000);
      // }
    });
  }

  ngOnInit(): void {
    this.accountsLoaded = false;
    this.dataStoreService.getAccounts();
    this.dataStoreService.getAllTransactions();
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

  navigateToAccount(id: string) {
    this.router.navigate(['/account', id]);
  }

  convertToNumber(s: string) {
    return parseFloat(s);
  }

  private generateNetWorth() {
    this.accountList?.forEach((account) => {
      console.log(account.balance);
      this.netWorth += parseFloat(account['balance']);
    });
  }

  private sortAccountByType() {
    this.accountList?.forEach((acc) => {
      if (
        acc.org.name.includes('Chase') ||
        acc.org.name.includes('American Express')
      ) {
        acc['type'] = 'Credit Card';
      } else if (acc.org.name.includes('Bank')) {
        acc['type'] = 'Bank';
      }
    });
  }
}
