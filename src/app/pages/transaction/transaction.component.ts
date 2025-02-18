import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { Subscription } from 'rxjs';
import { DataStore, Transaction } from '../../core/models/account.model';
import { CommonModule, Location } from '@angular/common';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { FormatUnixDatePipe } from '../../core/pipes/format-unix-date.pipe';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { CATEGORIES } from '../../core/constants';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { assignIcon, assignIconColor } from '../../core/utils/style.util';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormatDollarPipe,
    FormatUnixDatePipe,
    ButtonModule,
    CardModule,
    AvatarModule,
    DividerModule,
    DropdownModule,
    ProgressSpinnerModule,
    TooltipModule,
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
  transactionLoaded: boolean = false;
  transactionId: string | null = null;
  transaction$: Subscription | null = null;
  transaction: Transaction | null = null;
  editClicked: boolean = false;

  categories = CATEGORIES;
  assignIcon = assignIcon;
  assignIconColor = assignIconColor;

  constructor(
    private route: ActivatedRoute,
    private dataStoreService: DataStoreService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.transactionLoaded = false;
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.transaction$ = this.dataStoreService.dataStore.subscribe(
        (data: DataStore) => {
          this.transaction =
            data.transactions?.find((txn) => txn.id === this.transactionId) ||
            null;
        }
      );
    } else {
      console.error('Unable to get transaction', this.transaction);
    }
  }

  returnToDashboard() {
    this.location.back();
  }

  editCategory() {
    this.editClicked = !this.editClicked;
  }

  updateTransaction(event: any) {
    if (this.transaction)
      this.dataStoreService.updateTransactions([
        { id: this.transaction.id, category: event.value.name },
      ]);
    else alert('Unable to update category at this time, try again later.');
    this.editClicked = false;
  }
}
