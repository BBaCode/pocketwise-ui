import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Budget, BudgetRequest } from '../../core/models/budget.model';
import { DataStoreService } from '../../core/services/data-store/data-store.service';
import { DataStore } from '../../core/models/account.model';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit {
  budgets: Budget[] | null = [];
  budgets$: Subscription | null = null;
  toggleFormOn: boolean = false;
  month: number = 0;
  year: number = 0;

  addBudgetMessage: string = '';

  budgetForm = new FormGroup({
    date: new FormControl<string>('', [Validators.required]),
    amount: new FormControl<number>(0, [Validators.required]),
  });

  constructor(private ds: DataStoreService) {}

  ngOnInit(): void {
    this.ds.getAllBudgets();
    this.budgets$ = this.ds.dataStore.subscribe((store: DataStore) => {
      this.budgets = store.budgets;
    });
  }

  toggleForm() {
    this.toggleFormOn = !this.toggleFormOn;
  }

  onSubmit() {
    if (this.budgetForm.value.date && this.budgetForm.value.amount) {
      const date = new Date(this.budgetForm.value.date.toString());
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();

      const budgetRequest: BudgetRequest = {
        year: this.year,
        month: this.month,
        amount: this.budgetForm.value.amount,
      };
      this.ds.addNewBudget(budgetRequest);
    } else {
      console.log('no date');
    }
  }
}
