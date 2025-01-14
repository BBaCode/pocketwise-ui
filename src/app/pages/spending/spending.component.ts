import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { Subscription } from 'rxjs';
import { DataStore, Transaction } from '../../core/models/account.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { UpdateTransactionComponent } from '../update-transaction/update-transaction.component';
import { MonthlyChartComponent } from '../monthly-chart/monthly-chart.component';
import { format } from 'date-fns';
import { TransactionItemComponent } from '../../shared/transaction-item/transaction-item.component';
import { BudgetWidgetComponent } from '../../shared/budget-widget/budget-widget.component';

@Component({
  selector: 'app-spending',
  standalone: true,
  imports: [
    ChartModule,
    CommonModule,
    CardModule,
    DividerModule,
    FormatDollarPipe,
    ProgressSpinnerModule,
    ButtonModule,
    UpdateTransactionComponent,
    MonthlyChartComponent,
    TransactionItemComponent,
    BudgetWidgetComponent,
  ],
  templateUrl: './spending.component.html',
  styleUrl: './spending.component.scss',
})
export class SpendingComponent implements OnInit {
  isDialogOpen: boolean = false;
  transactions$: Subscription = new Subscription();
  transactionData: Transaction[] | null = null;
  nonCategorizedTransactions: Transaction[] | null = null;
  dataLoaded: boolean = false;
  chartData: any;
  options: any;
  months: any;
  totals: any;
  incomeTotals: any;
  currentMonth: string = '';

  filteredTransactions: Transaction[] | undefined;
  selectedCategory: string = '';
  isSpendView: boolean = true;
  currentView: string = 'Spend';

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
    '#138A36',
    '#9C27B0',
  ];

  constructor(
    private dataStore: DataStoreService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataLoaded = false;
  }

  async ngOnInit() {
    // may not need because its called in the dashboard
    if (!this.dataStore.dataStore.value.transactions)
      this.dataStore.getAllTransactions();
    this.transactions$ = await this.dataStore.dataStore.subscribe(
      (data: DataStore) => {
        if (!this.transactionData) this.refresh();
        this.transactionData = data.transactions;
        if (this.transactionData) {
          this.nonCategorizedTransactions = this.transactionData?.filter(
            (txn) => txn.category === 'Unknown'
          );
          this.getMonthlySpend(this.transactionData);
        }
      }
    );
  }

  setCategoryColor(category: any) {
    return category.color;
  }

  async refresh() {
    await this.dataStore.getAllTransactions();
  }
  toggleDialog() {
    this.isDialogOpen = true; // Open the dialog
  }

  handleDialogClose() {
    this.isDialogOpen = false; // Handle dialog close event
  }

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
    this.incomeTotals = Array.from(incomeTotals.values());
    this.currentMonth = this.months[this.months.length - 1];
    this.categoryArray = this.separateCategories(this.transactionData);
    this.onMonthSelected(this.currentMonth);
    this.dataLoaded = true;
  }

  onMonthSelected(month: string) {
    this.currentMonth = month;
    if (this.transactionData) {
      const filteredTransactions = this.transactionData.filter((txn) => {
        const txnMonth = format(new Date(txn.transacted_at * 1000), 'MMM');
        return txnMonth === month;
      });

      const categories = this.separateCategories(filteredTransactions);
      this.categoryArray = categories;
      this.buildChartData(categories); // Update pie chart data
      this.cdr.detectChanges();
    }
  }

  // when you click on a category,
  // filter all the txns of that category AND of that date
  // assign that to a variable AND a boolean to true to show the transactions

  handleCategorySelection(category: string) {
    this.selectedCategory = this.selectedCategory === category ? '' : category;
    this.filteredTransactions = this.transactionData
      ?.filter((txn) => txn.category === category)
      .filter((txn) => this.unixToDate(txn) === this.currentMonth)
      .sort((a, b) => {
        const dateA = new Date(a.transacted_at).getTime();
        const dateB = new Date(b.transacted_at).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
      });
    this.cdr.detectChanges();
  }

  toggleView() {
    this.isSpendView = !this.isSpendView;
    this.currentView = this.currentView === 'Spend' ? 'Budget' : 'Spend';
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
      Unknown: 0,
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

  private unixToDate(txn: Transaction): string {
    const monthCode = format(new Date(txn.transacted_at * 1000), 'MMM');
    return monthCode;
  }
}
