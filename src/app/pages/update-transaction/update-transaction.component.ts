import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { Transaction } from '../../core/models/account.model';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CATEGORIES } from '../../core/constants';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { DataStoreService } from '../../core/services/data-store/data-store.service';

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [
    DropdownModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    CardModule,
    ReactiveFormsModule,
    FormatDollarPipe,
  ],
  templateUrl: './update-transaction.component.html',
  styleUrls: ['./update-transaction.component.scss'],
})
export class UpdateTransactionComponent implements OnInit {
  @Input() uncategorizedTransactions: Array<Transaction> | null = null;
  @Input() isVisible: boolean = false;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  categories = CATEGORIES;
  updateTxnsForm!: FormGroup;

  constructor(private fb: FormBuilder, private ds: DataStoreService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    const formControls: { [key: string]: FormControl } = {};

    this.uncategorizedTransactions?.forEach((txn) => {
      formControls[txn.id] = new FormControl(null, Validators.required);
    });

    this.updateTxnsForm = this.fb.group(formControls);
  }

  onSubmit(): void {
    if (this.updateTxnsForm.valid) {
      const formValues = this.updateTxnsForm.value;

      const updatePayload = this.uncategorizedTransactions?.map((txn) => ({
        id: txn.id,
        category: formValues[txn.id].name,
      }));

      console.log(updatePayload);
      updatePayload ? this.ds.updateTransactions(updatePayload) : '';
      this.close.emit();
      this.updateTxnsForm.reset();
    }
  }
}
