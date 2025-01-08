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
import { AuthService } from '../../core/services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

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
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$: Subscription;
  accountList: Account[] | null = null;
  groupedAccounts: { type: string; total: number }[] = [];
  typeList: string[] = [
    'Credit Card',
    'Bank',
    'HSA',
    'Investment',
    'Retirement',
  ];
  accountsLoaded: boolean = false;
  netWorth: number = 0;
  serverError: string = '';
  userName: string = '';

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
      this.userName = localStorage.getItem('userName') || '';
      this.accountsLoaded = true;
      console.log('db constructed, account list:', this.accountList);
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

  navigateToAccount(id: string) {
    this.router.navigate(['/accounts', id.toLowerCase()]);
  }

  convertToNumber(s: string) {
    return parseFloat(s);
  }

  async refreshData() {
    this.accountsLoaded = false;
    await this.dataStoreService.loadUpdatedAccounts();
  }

  private generateNetWorth() {
    this.accountList?.forEach((account) => {
      console.log(account.balance);
      this.netWorth += parseFloat(account['balance']);
    });
  }

  // will need to update for Carolines account I imagine
  // TODO: move this to backend
  private sortAccountByType() {
    this.accountList?.forEach((acc) => {
      if (
        acc.org.name.includes('Chase') ||
        acc.org.name.includes('American Express')
      ) {
        acc['type'] = 'Credit Cards';
      } else if (acc.org.name.includes('Bank')) {
        acc['type'] = 'Banks';
      } else if (
        acc.name.includes('Retirement') ||
        acc.name.toLowerCase().includes('rhrp') ||
        acc.name.toLowerCase().includes('ret')
      ) {
        acc['type'] = 'Retirement';
      } else if (
        acc.org.name.includes('Fidelity') ||
        acc.name.toLowerCase().includes('fid') ||
        acc.name.includes('Health') ||
        acc.name.toLowerCase().includes('HSA')
      ) {
        acc['type'] = 'Investments';
      } else acc['type'] = 'Other';
    });
    this.accountList?.sort((a, b) => a.type.localeCompare(b.type));
    console.log('accL', this.accountList);
    this.groupedAccounts = this.groupAccountsByType(this.accountList);
  }

  groupAccountsByType(
    accounts: Account[] | null
  ): { type: string; total: number }[] {
    if (accounts) {
      const grouped = accounts.reduce((acc, account) => {
        const type = account.type;
        const balance = parseFloat(account.balance); // Convert balance to a number

        if (!acc[type]) {
          acc[type] = 0;
        }

        acc[type] += balance;
        return acc;
      }, {} as Record<string, number>);

      return Object.keys(grouped).map((type) => ({
        type,
        total: grouped[type],
      }));
    } else return [{ type: 'No Accounts', total: 0 }];
  }
}
