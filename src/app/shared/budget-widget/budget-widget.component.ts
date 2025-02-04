import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';

import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { BadgeModule } from 'primeng/badge';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { Budget } from '../../core/models/budget.model';
import { Subscription } from 'rxjs';
import { DataStore, Transaction } from '../../core/models/account.model';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { format } from 'date-fns';

@Component({
  selector: 'app-budget-widget',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    FormatDollarPipe,
    TagModule,
    ChartModule,
    BadgeModule,
    ButtonModule,
  ],
  templateUrl: './budget-widget.component.html',
  styleUrl: './budget-widget.component.scss',
})
export class BudgetWidgetComponent implements OnInit {
  constructor(private ds: DataStoreService, private router: Router) {}

  data: any;
  options: any;
  budgets: Budget[] | null = [];
  budgets$: Subscription | null = null;
  currentBudgetTotal: number = 0;

  left: number = 0;
  percent: string = '';

  transactions: Transaction[] | null = null;
  months: any;
  totals: any;
  currentMonth: any;
  currentYear: any;
  spent: any;

  ngOnInit() {
    this.budgets$ = this.ds.dataStore.subscribe((store: DataStore) => {
      this.budgets = store.budgets;
      if (!store.currentBudget) {
        this.currentBudgetTotal = 0;
        return;
      }
      this.currentBudgetTotal = store.currentBudget?.total || 0;
      this.currentMonth = store.currentBudget?.month;
      this.currentYear = store.currentBudget?.year;
      this.transactions = store.transactions;
      if (this.transactions) this.getMonthlySpend(this.transactions);
      this.initChart();
    });
    this.ds.getAllTransactions();
  }

  navigateToBudget() {
    this.router.navigate(['/budget']);
  }

  // TODO: Figure out how to simplify and abstract this function
  getMonthlySpend(transactions: Transaction[]) {
    const monthlyTotals = new Map<string, number>();
    const incomeTotals = new Map<string, number>();

    for (const transaction of transactions) {
      const monthCode = this.unixToDate(transaction);
      const amount = parseFloat(transaction.amount); // Correct conversion

      if (
        transaction.category !== 'Credit Card Payment' &&
        transaction.category !== 'Income' &&
        transaction.category !== 'Transfer'
      ) {
        monthlyTotals.set(
          monthCode,
          (monthlyTotals.get(monthCode) || 0) + Math.abs(amount)
        );
      } else if (transaction.category === 'Income') {
        incomeTotals.set(
          monthCode,
          (incomeTotals.get(monthCode) || 0) + Math.abs(amount)
        );
      }
    }

    this.months = Array.from(monthlyTotals.keys());
    this.totals = Array.from(monthlyTotals.values());
    this.spent = this.months.includes(
      this.currentMonth + '/' + this.currentYear
    )
      ? this.totals[this.totals.length - 1]
      : 0;
    this.left = this.currentBudgetTotal - this.spent;
    this.calcAndFormatPercent();
  }

  private unixToDate(txn: Transaction): string {
    const monthCode = format(new Date(txn.transacted_at * 1000), 'MM/yyyy');
    return monthCode;
  }

  private calcAndFormatPercent() {
    const float = Math.round((this.spent / this.currentBudgetTotal) * 100);
    this.percent = float.toString() + '%';
  }

  private initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const blue = documentStyle.getPropertyValue('--blue-500');
    const red = documentStyle.getPropertyValue('--red-500');
    const barColor = this.left > 0 ? blue : red;

    this.data = {
      labels: ['Spent', 'Left'],
      datasets: [
        {
          data: [this.left, this.spent],
          backgroundColor: [barColor, 'black'],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--gray-700'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
