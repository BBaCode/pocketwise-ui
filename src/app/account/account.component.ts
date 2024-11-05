import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimplefinService } from '../services/simplefin/simplefin.service';
import { Account } from '../models/account.model';
import { TableModule } from 'primeng/table';
import { EtDatePipe } from '../pipes/et-date.pipe';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormatDollarPipe } from '../pipes/format-dollar.pipe';

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
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  accountId: string | null = null;
  accountData: Account | null = null;
  transactions: any[] = [];

  constructor(private route: ActivatedRoute, private sf: SimplefinService) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('id');
    if (this.accountId) this.loadAccountData(this.accountId);
  }

  loadAccountData(id: string) {
    this.sf.simplefinDataStore.subscribe((data) => {
      this.accountData = data.accounts.find(
        (account: Account) => account.id === id
      );
      if (this.accountData?.transactions)
        this.transactions = this.accountData?.transactions;
      console.log(this.transactions);
    });
  }
}
