import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimplefinService } from '../services/simplefin/simplefin.service';
import { Account, DataStore } from '../models/account.model';
import { TableModule } from 'primeng/table';
import { EtDatePipe } from '../pipes/et-date.pipe';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormatDollarPipe } from '../pipes/format-dollar.pipe';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
  accountId: string | null = null;
  transactions$: Subscription;
  transactions: any[] = [];
  transactionsLoaded: boolean = false;

  constructor(private route: ActivatedRoute, private sf: SimplefinService) {
    this.transactions$ = this.sf.simplefinDataStore.subscribe(
      (data: DataStore) => {
        this.transactions = data.transactions;
        this.transactionsLoaded = true;
        console.log('transactions constructed', this.transactions);
      }
    );
  }

  ngOnInit(): void {
    console.log('initing account trans');
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) {
      this.sf.getTransactionsForAccount(this.accountId);
    } else {
      console.error('Unable to get transactions for account', this.accountId);
    }
    console.log('initted account trans succssfully');
  }

  ngOnDestroy(): void {
    console.log('destroying account trans');
    this.transactions$.unsubscribe();
    this.transactionsLoaded = false;
    console.log('destoyed account trans');
  }
}
