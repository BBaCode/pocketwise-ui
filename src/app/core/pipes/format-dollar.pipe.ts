import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDollar',
  standalone: true,
})
export class FormatDollarPipe implements PipeTransform {
  transform(value: string): string {
    const number = parseFloat(value);
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
