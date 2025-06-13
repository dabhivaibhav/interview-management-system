import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntervieweeDetailsDialogComponent } from '../interviewee-details-dialog/interviewee-details-dialog.component';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import { addDays, addHours, addMinutes, startOfDay } from 'date-fns';

const colors: Record<string, EventColor> = {
  purple: {
    primary: '#673ab7',
    secondary: '#a096ff'
  }
};

@Component({
  selector: 'app-view-interviewer-availability-dialog',
  templateUrl: './view-interviewer-availability-dialog.component.html',
  styleUrls: ['./view-interviewer-availability-dialog.component.css']
})
export class ViewInterviewerAvailabilityDialogComponent implements OnInit, OnDestroy {

  view: CalendarView = CalendarView.Week;
  isLoading = false;
    viewDate = new Date('1970-01-05');
    daysInWeek = 5;
    dayStartHour = 9;
    dayEndHour = 17;
    excludeDays: number[] = [0, 6];
    private destroy$ = new Subject<void>();
    events: CalendarEvent[] = [];
    modalData: {
      action: string;
      event: CalendarEvent;
    } | undefined;


  constructor( public dialogRef: MatDialogRef<IntervieweeDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.events = this.data?.map((d: any) => {
      return {
        title: '',
        start: addMinutes(addHours(startOfDay(addDays(this.viewDate, (d.weekDay) - 1)),
          d.startTime.split(':')[0]), d.startTime.split(':')[1]),
        end: addMinutes(addHours(startOfDay(addDays(this.viewDate, (d.weekDay) - 1)),
          d.endTime.split(':')[0]), d.endTime.split(':')[1]),
        color: colors.purple,
      };
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
