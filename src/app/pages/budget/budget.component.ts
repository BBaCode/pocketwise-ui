import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { FormatUnixDatePipe } from '../../core/pipes/format-unix-date.pipe';
import { FormatDatePipe } from '../../core/pipes/format-date.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BudgetWidgetComponent } from '../../shared/budget-widget/budget-widget.component';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

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
    FormatDollarPipe,
    FormatUnixDatePipe,
    FormatDatePipe,
    ProgressSpinnerModule,
    BudgetWidgetComponent,
    TooltipModule,
    DividerModule,
    MessagesModule,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent implements OnInit, OnDestroy {
  budgets: Budget[] | null = [];
  budgets$: Subscription | null = null;
  budgetForms: FormArray;
  isFormOpen: boolean = false;
  month: number = 0;
  year: number = 0;
  total: number = 0;
  currentEditBudgetInView: number = -1;
  currentViewBudgetInView: number = -1;

  addBudgetMessage: string = '';
  message: Message[] = [];
  dataLoaded: boolean = false;

  budgetForm = new FormGroup({
    date: new FormControl<string>('', [Validators.required]),
    food: new FormControl<number>(0, [Validators.required]),
    groceries: new FormControl<number>(0, [Validators.required]),
    transportation: new FormControl<number>(0, [Validators.required]),
    entertainment: new FormControl<number>(0, [Validators.required]),
    health: new FormControl<number>(0, [Validators.required]),
    shopping: new FormControl<number>(0, [Validators.required]),
    utilities: new FormControl<number>(0, [Validators.required]),
    housing: new FormControl<number>(0, [Validators.required]),
    travel: new FormControl<number>(0, [Validators.required]),
    education: new FormControl<number>(0, [Validators.required]),
    subscriptions: new FormControl<number>(0, [Validators.required]),
    gifts: new FormControl<number>(0, [Validators.required]),
    insurance: new FormControl<number>(0, [Validators.required]),
    personal_care: new FormControl<number>(0, [Validators.required]),
    other: new FormControl<number>(0, [Validators.required]),
    unknown: new FormControl<number>(0, [Validators.required]),
  });

  constructor(
    private ds: DataStoreService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.budgetForms = this.fb.array([]);
  }

  ngOnInit(): void {
    this.budgetForm.valueChanges.subscribe(() => {
      this.updateTotal();
      if (this.budgetForm.value.date) {
        const date = new Date(this.budgetForm.value.date.toString());
        this.month = date.getMonth() + 1;
        this.year = date.getFullYear();

        if (this.budgets) {
          let isDuplicate = false; // Flag to track duplicates
          this.budgets.forEach((budget) => {
            if (budget.month === this.month && budget.year === this.year) {
              isDuplicate = true; // Set flag if duplicate is found
              this.budgetForm.setErrors({ invalid: true });
              this.budgetForm.controls.date.setErrors({ invalid: true });
            }
          });

          // Set the message based on the flag
          this.message = isDuplicate
            ? [
                {
                  severity: 'error',
                  detail: 'A budget for this month already exists',
                },
              ]
            : [];
          this.cdr.detectChanges(); // Trigger change detection
        }
      }
    });

    this.ds.getAllBudgets();
    this.budgets$ = this.ds.dataStore.subscribe((store: DataStore) => {
      this.budgets = store.budgets;

      if (this.budgets) {
        this.budgets.sort((a, b) => {
          if (b.year !== a.year) {
            return b.year - a.year; // Sort by year descending
          }
          return b.month - a.month; // If same year, sort by month descending
        });
      }

      this.initExistingBudgets();
      this.dataLoaded = true;
    });
  }

  ngOnDestroy(): void {
    if (this.budgets$) {
      this.budgets$.unsubscribe();
    }
  }

  toggleNewForm() {
    this.isFormOpen = !this.isFormOpen;
    this.currentEditBudgetInView = -1;
    this.currentViewBudgetInView = -1;
    this.message = [];
  }

  toggleEditForm(index: number) {
    this.currentEditBudgetInView =
      index === this.currentEditBudgetInView ? -1 : index;
    if (this.currentEditBudgetInView === -1) this.ds.getAllBudgets();
    this.currentViewBudgetInView = -1;
    this.isFormOpen = false;
  }

  cancelEditForm() {
    this.currentEditBudgetInView = -1;
    this.currentViewBudgetInView = -1;
  }

  toggleBudgetView(index: number) {
    this.currentViewBudgetInView =
      index === this.currentViewBudgetInView ? -1 : index;
    this.currentEditBudgetInView = -1;
    this.isFormOpen = false;
  }

  updateTotal(): void {
    const formValues = this.budgetForm.value;

    this.total = Object.keys(formValues)
      .filter((key) => key !== 'date') // Exclude 'date' and 'total'
      .reduce((sum, key) => {
        const value = formValues[key as keyof typeof formValues] || 0;
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
  }

  async deleteBudget(budgetId: number) {
    await this.ds.deleteBudget(budgetId.toString());
  }

  async onSubmit() {
    if (this.budgetForm.value.date) {
      const date = new Date(this.budgetForm.value.date.toString());
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();

      const budgetRequest: BudgetRequest = {
        year: this.year,
        month: this.month,
        total: this.total,
        food: this.budgetForm.value.food ?? 0,
        groceries: this.budgetForm.value.groceries ?? 0,
        transportation: this.budgetForm.value.transportation ?? 0,
        entertainment: this.budgetForm.value.entertainment ?? 0,
        health: this.budgetForm.value.health ?? 0,
        shopping: this.budgetForm.value.shopping ?? 0,
        utilities: this.budgetForm.value.utilities ?? 0,
        housing: this.budgetForm.value.housing ?? 0,
        travel: this.budgetForm.value.travel ?? 0,
        education: this.budgetForm.value.education ?? 0,
        subscriptions: this.budgetForm.value.subscriptions ?? 0,
        gifts: this.budgetForm.value.gifts ?? 0,
        insurance: this.budgetForm.value.insurance ?? 0,
        personal_care: this.budgetForm.value.personal_care ?? 0,
        other: this.budgetForm.value.other ?? 0,
        unknown: this.budgetForm.value.unknown ?? 0,
      };
      this.dataLoaded = false;
      await this.ds.addNewBudget(budgetRequest);
      this.toggleNewForm();
    } else {
      console.log('no date');
    }
  }

  async onEditSubmit(index: number) {
    const editedBudgetForm = this.getBudgetForm(index);
    if (editedBudgetForm.value.date) {
      const date = new Date(editedBudgetForm.value.date.toString());
      this.month = date.getMonth() + 1;
      this.year = date.getFullYear();
    }
    const values: Budget = editedBudgetForm.value;
    this.calculateTotal(editedBudgetForm);

    const budgetRequest: BudgetRequest = {
      year: this.year || values.year,
      month: this.month || values.month,
      total: this.total,
      food: values.food,
      groceries: values.groceries,
      transportation: values.transportation,
      entertainment: values.entertainment,
      health: values.health,
      shopping: values.shopping,
      utilities: values.utilities,
      housing: values.housing,
      travel: values.travel,
      education: values.education,
      subscriptions: values.subscriptions,
      gifts: values.gifts,
      insurance: values.insurance,
      personal_care: values.personal_care,
      other: values.other,
      unknown: values.unknown,
    };
    this.dataLoaded = false;
    await this.ds.updateBudget(values.id.toString(), budgetRequest);
    this.toggleEditForm(-1);
    this.total = 0;
    this.month = 0;
    this.year = 0;
  }

  initExistingBudgets() {
    this.budgets?.forEach((budget) => {
      const budgetForm = this.fb.group({
        id: [budget.id],
        date: [`${budget.month}/${budget.year}`],
        month: [budget.month],
        year: [budget.year],
        total: [budget.total],
        food: [budget.food],
        groceries: [budget.groceries],
        transportation: [budget.transportation],
        entertainment: [budget.entertainment],
        health: [budget.health],
        shopping: [budget.shopping],
        utilities: [budget.utilities],
        housing: [budget.housing],
        travel: [budget.travel],
        education: [budget.education],
        subscriptions: [budget.subscriptions],
        gifts: [budget.gifts],
        insurance: [budget.insurance],
        personal_care: [budget.personal_care],
        other: [budget.other],
        unknown: [budget.unknown],
      });
      this.calculateTotal(budgetForm);

      // Subscribe to value changes to track updates
      budgetForm.valueChanges.subscribe(() => {
        this.calculateTotal(budgetForm);
      });
      this.budgetForms.push(budgetForm);
    });
  }

  // Method to calculate the total based on the form values
  calculateTotal(budgetForm: FormGroup) {
    const values = budgetForm.value;
    const total = Object.keys(values)
      .filter(
        (key) =>
          key !== 'date' &&
          key !== 'month' &&
          key !== 'year' &&
          key !== 'id' &&
          key !== 'total'
      ) // Exclude from the total calculation
      .reduce((sum, key) => sum + (parseFloat(values[key]) || 0), 0);
    // Find the index of the form group and update the budget total
    const index = this.budgetForms.controls.indexOf(budgetForm);
    if (index !== -1) {
      if (this.budgets) this.budgets[index].total = total; // Update the total for the specific budget
      this.total = total;
    }
  }

  getBudgetForm(index: number): FormGroup {
    return this.budgetForms.at(index) as FormGroup;
  }
}
