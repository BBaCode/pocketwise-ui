import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { Subscription } from 'rxjs';
import { DataStore, Transaction } from '../../core/models/account.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    ChartModule,
    CommonModule,
    CardModule,
    DividerModule,
    FormatDollarPipe,
    ProgressSpinnerModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  transactions$: Subscription = new Subscription();
  transactionData: Transaction[] | null = null;
  dataLoaded: boolean = false;
  chartData: any;
  options: any;
  categoryArray: { name: string; value: number; color: string }[] = []; // Array for labels and amounts
  colorPalette: string[] = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#E7E9ED',
    '#C9CBFF',
    '#FF6F61',
    '#9E9D24',
    '#F57F17',
    '#4CAF50',
    '#3F51B5',
    '#D32F2F',
    '#5D4037',
    '#9C27B0',
  ];

  constructor(private sf: DataStoreService) {
    this.dataLoaded = false;
  }

  ngOnInit() {
    this.sf.getAllTransactions();
    this.transactions$ = this.sf.dataStore.subscribe((data: DataStore) => {
      this.transactionData = data.transactions;
      this.categoryArray = this.separateCategories(this.transactionData);
      this.buildChartData(this.categoryArray);
      this.dataLoaded = true;
    });
  }

  setCategoryColor(category: any) {
    return category.color;
  }

  private separateCategories(
    transactions: Transaction[] | null
  ): { name: string; value: number; color: string }[] {
    const categories: { [key: string]: number } = {
      'Food & Dining': 0,
      Groceries: 0,
      Transportation: 0,
      Entertainment: 0,
      'Health & Wellness': 0,
      Shopping: 0,
      Utilities: 0,
      Rent: 0,
      Travel: 0,
      Education: 0,
      Subscriptions: 0,
      'Gifts & Donations': 0,
      Insurance: 0,
      'Personal Care': 0,
      Other: 0,
    };

    // Accumulate transaction amounts into categories
    transactions?.forEach((txn) => {
      if (categories[txn.category] !== undefined) {
        categories[txn.category] += Math.abs(parseFloat(txn.amount));
      }
    });

    // Convert categories into an array of objects
    const catArr = Object.keys(categories).map((key, index) => ({
      name: key,
      value: categories[key],
      color: this.colorPalette[index % this.colorPalette.length],
    }));

    return catArr.sort((a, b) => b.value - a.value);
  }

  private buildChartData(
    categories: { name: string; value: number; color: string }[]
  ): void {
    this.chartData = {
      labels: categories.map((cat) => cat.name),
      datasets: [
        {
          data: categories.map((cat) => cat.value),
          backgroundColor: categories.map((cat) => cat.color),
        },
      ],
    };
    this.options = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
