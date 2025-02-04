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
import { Budget } from '../../core/models/budget.model';

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
  dates: any;
  totals: any;
  incomeTotals: any;
  currentDate: string = '';
  budgets: Budget[] | null = [];
  // This is from the data store itself and is the current budget for the month
  currentBudget: Budget | null = null;
  // This is the budget that is selected by the user in the spending component
  selectedBudget: Budget | null = null;

  filteredTransactions: Transaction[] | undefined;
  selectedCategory: string = '';
  isSpendView: boolean = true;
  currentView: string = 'Spend';

  categoryArray: {
    name: string;
    value: number;
    color: string;
    budgetValue?: number;
  }[] = []; // Array for labels and amounts
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
  ) {}

  ngOnInit() {
    this.dataLoaded = false;
    // may not need because its called in the dashboard
    if (!this.dataStore.dataStore.value.transactions)
      this.dataStore.getAllTransactions();
    this.dataStore.getAllBudgets();
    this.transactions$ = this.dataStore.dataStore.subscribe(
      (data: DataStore) => {
        if (!this.transactionData) this.refresh();
        this.transactionData = data.transactions;
        this.selectedBudget = data.currentBudget;
        this.budgets = data.budgets;
        if (this.transactionData && this.transactionData.length > 0) {
          this.nonCategorizedTransactions = this.transactionData?.filter(
            (txn) => txn.category === 'Unknown'
          );
          this.getMonthlySpend(this.transactionData);
        } else this.dataLoaded = true;
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
    if (!transactions) {
      this.dataLoaded = true;
      return;
    }
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

    this.dates = Array.from(monthlyTotals.keys());
    this.totals = Array.from(monthlyTotals.values());
    this.incomeTotals = Array.from(incomeTotals.values());
    this.currentDate = this.dates[this.dates.length - 1];
    this.categoryArray = this.separateCategories(this.transactionData);
    this.onDateSelected(this.currentDate);
    this.dataLoaded = true;
  }

  onDateSelected(month: string) {
    this.currentDate = month;
    this.selectedBudget =
      month.charAt(0) === '0'
        ? this.budgets?.find(
            (budget) => '0' + budget.month + '/' + budget.year === month
          ) ?? null
        : this.budgets?.find(
            (budget) => budget.month + '/' + budget.year === month
          ) ?? null;
    if (this.transactionData) {
      const filteredTransactions = this.transactionData.filter((txn) => {
        const txnMonth = this.unixToDate(txn);
        return txnMonth === month;
      });

      const categories = this.separateCategories(filteredTransactions);
      this.categoryArray = categories;
      this.matchBudgetToCategory();
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
      .filter((txn) => this.unixToDate(txn) === this.currentDate)
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
      Housing: 0,
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
    const monthCode = format(new Date(txn.transacted_at * 1000), 'MM/yyyy');
    return monthCode;
  }

  // I need to add a method to match each category total to the budgeted amount
  // and show both values in the budget view of the spending page
  // This should take in the current budget and list of categories and match them up, renaming
  // the category to the budgeted category name

  private matchBudgetToCategory() {
    if (this.selectedBudget && this.categoryArray) {
      this.categoryArray.forEach((category) => {
        if (category.name === 'Food & Dining') {
          category.budgetValue = this.selectedBudget?.food;
        } else if (category.name === 'Gifts & Donations') {
          category.budgetValue = this.selectedBudget?.gifts;
        } else if (category.name === 'Health & Wellness') {
          category.budgetValue = this.selectedBudget?.health;
        } else if (category.name === 'Personal Care') {
          category.budgetValue = this.selectedBudget?.personal_care;
        } else if (category.name === 'Entertainment') {
          category.budgetValue = this.selectedBudget?.entertainment;
        } else if (category.name === 'Education') {
          category.budgetValue = this.selectedBudget?.education;
        } else if (category.name === 'Groceries') {
          category.budgetValue = this.selectedBudget?.groceries;
        } else if (category.name === 'Insurance') {
          category.budgetValue = this.selectedBudget?.insurance;
        } else if (category.name === 'Housing') {
          category.budgetValue = this.selectedBudget?.housing;
        } else if (category.name === 'Shopping') {
          category.budgetValue = this.selectedBudget?.shopping;
        } else if (category.name === 'Subscriptions') {
          category.budgetValue = this.selectedBudget?.subscriptions;
        } else if (category.name === 'Transportation') {
          category.budgetValue = this.selectedBudget?.transportation;
        } else if (category.name === 'Travel') {
          category.budgetValue = this.selectedBudget?.travel;
        } else if (category.name === 'Utilities') {
          category.budgetValue = this.selectedBudget?.utilities;
        } else if (category.name === 'Other') {
          category.budgetValue = this.selectedBudget?.other;
        }
      });
    }
  }
}
