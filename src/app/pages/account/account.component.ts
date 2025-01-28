import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import {
  Account,
  DataStore,
  Transaction,
} from '../../core/models/account.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { assignIcon, assignIconColor } from '../../core/utils/style.util';
import { FormatUnixDatePipe } from '../../core/pipes/format-unix-date.pipe';
import { TransactionItemComponent } from '../../shared/transaction-item/transaction-item.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    TableModule,
    FormatUnixDatePipe,
    CardModule,
    CommonModule,
    AvatarModule,
    FormatDollarPipe,
    ProgressSpinnerModule,
    TransactionItemComponent,
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
  assignIcon = assignIcon;
  assignIconColor = assignIconColor;

  constructor(
    private route: ActivatedRoute,
    private dataStoreService: DataStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngoninit begins', this.transactionsLoaded);
    this.transactionsLoaded = false;
    this.accountId = this.route.snapshot.paramMap.get('id');
    console.log(this.accountId);
    if (this.accountId) {
      this.transactions$ = this.dataStoreService.dataStore.subscribe(
        (data: DataStore) => {
          console.log(data.accounts);
          this.account = data.accounts?.find(
            (acc) => acc.id === this.accountId
          );
          if (!this.transactions) this.refresh();
          console.log(this.account);
          this.transactions =
            data.transactions
              ?.filter((txn) => txn.account_id === this.accountId)
              ?.sort((a, b) => {
                const dateA = new Date(a.transacted_at).getTime();
                const dateB = new Date(b.transacted_at).getTime();
                return dateB - dateA; // Sort in descending order (newest first)
              }) || null;

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

  async refresh() {
    await this.dataStoreService.getAllTransactions();
  }

  navigateToTransaction(id: string) {
    this.router.navigate(['/transaction', id]);
  }
}
