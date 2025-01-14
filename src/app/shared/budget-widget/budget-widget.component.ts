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
import { DataStore } from '../../core/models/account.model';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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

  budgetAmount: number = 2000;
  monthlyExpenditure: number = 1700;
  difference = this.budgetAmount - this.monthlyExpenditure;
  percent: string = '';

  ngOnInit() {
    this.budgets$ = this.ds.dataStore.subscribe((store: DataStore) => {
      this.budgets = store.budgets;
    });
    this.initChart();
    this.calcAndFormatPercent();
  }

  navigateToBudget() {
    this.router.navigate(['/budget']);
  }

  private calcAndFormatPercent() {
    const float = Math.round(
      (this.monthlyExpenditure / this.budgetAmount) * 100
    );
    this.percent = float.toString() + '%';
  }

  private initChart() {
    const documentStyle = getComputedStyle(document.documentElement);

    this.data = {
      labels: ['Spent', 'Left'],
      datasets: [
        {
          data: [this.monthlyExpenditure, this.difference],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            'black',
          ],
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
