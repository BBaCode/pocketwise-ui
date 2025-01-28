import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { FormatUnixDatePipe } from '../../core/pipes/format-unix-date.pipe';
import { FormatDollarPipe } from '../../core/pipes/format-dollar.pipe';
import { Transaction } from '../../core/models/account.model';
import { assignIcon, assignIconColor } from '../../core/utils/style.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-item',
  standalone: true,
  imports: [AvatarModule, CommonModule, FormatUnixDatePipe, FormatDollarPipe],
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
})
export class TransactionItemComponent {
  constructor(private router: Router) {}

  @Input() transactions: Transaction[] | null | undefined = null;
  @Input() showIcon: boolean = false;

  assignIcon = assignIcon;
  assignIconColor = assignIconColor;

  navigateToTransaction(id: string) {
    this.router.navigate(['/transaction', id]);
  }
}
