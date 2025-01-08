import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Account, DataStore } from '../../core/models/account.model';
import { CardModule } from 'primeng/card';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-account-group',
  standalone: true,
  imports: [CommonModule, CardModule, FormatDollarPipe, TagModule],
  templateUrl: './account-group.component.html',
  styleUrl: './account-group.component.scss',
})
export class AccountGroupComponent implements OnInit, OnDestroy {
  accountType: string | null = null;
  accounts$: Subscription;
  accountList: Account[] | null = [];
  filteredAccounts: Account[] | undefined = [];

  constructor(
    private ds: DataStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.accounts$ = ds.dataStore.subscribe((data: DataStore) => {
      this.accountList = data.accounts;
    });
  }
  ngOnInit(): void {
    this.accountType = this.route.snapshot.paramMap.get('id');
    if (this.accountList) {
      this.filterAccountsByType();
    }
    console.log(this.accountType);
  }
  ngOnDestroy(): void {
    if (this.accounts$) {
      this.accounts$.unsubscribe();
    }
  }

  // TODO: make into a util as its used in many place
  convertToNumber(s: string) {
    return parseFloat(s);
  }
  // TODO: util?
  navigateToAccount(id: string) {
    this.router.navigate([`accounts/${this.accountType}/account`, id]);
  }

  groupImage(accType: string | null): string {
    const normalizedType = accType?.trim().toLowerCase().replace(' ', '-');

    // Construct the file path
    const filePath = `assets/images/${normalizedType}.jpg`;

    console.log(filePath);
    // Return the constructed path, with a fallback to a default image
    return filePath || 'assets/images/dog.jpg';
  }

  private filterAccountsByType() {
    this.filteredAccounts = this.accountList?.filter(
      (acc) => acc.account_type.toLowerCase() === this.accountType
    );
  }
}
