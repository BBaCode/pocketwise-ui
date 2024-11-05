import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SimplefinService } from '../services/simplefin/simplefin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$: Subscription;
  accountList: any;

  constructor(private sf: SimplefinService) {
    this.accounts$ = sf.simplefinDataStore.subscribe((data) => {
      this.accountList = data;
    });
  }

  ngOnInit(): void {
    this.sf.getAccounts();
    //some kind of setup functionality
    console.log(this.accountList);
  }

  ngOnDestroy(): void {
    this.accounts$.unsubscribe();
  }
}
