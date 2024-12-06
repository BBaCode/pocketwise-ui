import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { Transaction } from '../../core/models/account.model';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { CATEGORIES } from '../../core/constants';
@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [
    DropdownModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    CardModule,
    FormsModule,
  ],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.scss',
})
export class UpdateTransactionComponent implements OnInit {
  @Input() uncategorizedTransactions: Array<Transaction> | null = null;
  @Input() isVisible: boolean = false; // Receives visibility state from parent
  @Output() close: EventEmitter<void> = new EventEmitter<void>(); // Emits event when dialog closes

  categories: any;

  selectedCategory: any;

  ngOnInit() {
    this.categories = CATEGORIES;
  }

  onDialogClose() {
    this.close.emit(); // Notify parent that the dialog should be closed
  }
}
