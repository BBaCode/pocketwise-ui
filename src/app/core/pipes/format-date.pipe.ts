import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return ''; // Handle null or undefined input
    return value.substring(0, 10);
  }
}
