import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduleAtDateTime'
})
export class ScheduleAtDateTimePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    const date = new Date(String(value)).toLocaleString('en-GB', options);
    if (date === 'Invalid Date') {
      return null;
    }
    else{
      return date;
    }
  }

}
