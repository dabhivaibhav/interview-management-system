import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeRange'
})
export class TimeRangePipe implements PipeTransform {
  transform(date: Date): string {
    const startHour = this.formatTime(date.getHours());
    const startMinute = this.formatTime(date.getMinutes());
    const endHour = this.formatTime(date.getHours() + 1);
    const endMinute = this.formatTime(date.getMinutes());
    return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
  }

  private formatTime(time: number): string {
    return time < 10 ? '0' + time : time.toString();
  }

}
