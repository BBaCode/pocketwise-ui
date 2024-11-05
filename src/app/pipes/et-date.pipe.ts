import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etDate',
  standalone: true,
})
export class EtDatePipe implements PipeTransform {
  transform(timestamp: number): string {
    // Create a Date object from the Unix timestamp
    const date = new Date(timestamp * 1000);

    // Convert to Eastern Time (ET)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    // Format the date as a string in the ET time zone
    return date.toLocaleString('en-US', options);
  }
}
