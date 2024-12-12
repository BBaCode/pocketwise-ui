import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDollar',
  standalone: true,
})
export class FormatDollarPipe implements PipeTransform {
  transform(value: string | number): string {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      currencySign: 'standard',
      currency: 'USD',
      currencyDisplay: 'symbol',
      style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  }
}
