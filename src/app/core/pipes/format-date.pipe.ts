import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true, // Use this if using the pipe in standalone components
})
export class FormatDatePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return ''; // Handle null or undefined input

    const date = new Date(value * 1000); // Convert Unix timestamp (seconds) to milliseconds
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
}
