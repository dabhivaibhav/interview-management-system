import { Component, OnDestroy, OnInit, } from '@angular/core';
import { startOfDay, addHours, addMinutes, addDays, format, } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarView, } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { NotificationService } from 'src/app/notification.service';
import { DialogService } from '../../service/dialog.service';
import { AvailabilityService } from '../../service/availability.service';
import * as moment from 'moment';

const colors: Record<string, EventColor> = {
  purple: {
    primary: '#673ab7',
    secondary: '#a096ff'
  }
};

@Component({
  selector: 'app-interviewer-availability',
  templateUrl: './interviewer-availability.component.html',
  styleUrls: ['./interviewer-availability.component.css'],
})
export class InterviewerAvailabilityComponent implements OnInit, OnDestroy {

  view: CalendarView = CalendarView.Week;
  isLoading = false;
  allAvailability: any[] = [];
  viewDate = new Date('1970-01-05');
  daysInWeek = 5;
  dayStartHour = 9;
  dayEndHour = 17;
  excludeDays: number[] = [0, 6];
  private destroy$ = new Subject<void>();
  op !: string;
  event: any;
  allEvent: any;
  events: CalendarEvent[] = [];
  tempEvents: CalendarEvent[] = [];
  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;
  addList: any = [];
  isTwoHoursGap = true;
  minDayError = false ;

  constructor(
    private dialog: DialogService,
    private availabilityService: AvailabilityService,
    private notifyService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAvailability();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getAvailability(): void {
    this.isLoading = true;
    this.availabilityService.getAvailability().subscribe(
      (response: any) => {
        if (response.response) {
          this.allAvailability = response.data;
          this.events = this.allAvailability?.map((d: any) => {
            return {
              title: '',
              start: addMinutes(addHours(startOfDay(addDays(this.viewDate, (d.weekDay) - 1)),
                d.startTime.split(':')[0]), d.startTime.split(':')[1]),
              end: addMinutes(addHours(startOfDay(addDays(this.viewDate, (d.weekDay) - 1)),
                d.endTime.split(':')[0]), d.endTime.split(':')[1]),
              id: d.id,
              color: colors.purple,
            };
          });
          this.tempEvents.forEach((ele: any) => {
             this.events.push(ele);
          });
        } else {
          this.notifyService.showError(response.message, 'Failed');
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!', 'Failed');
      }
    );
  }

  addMyAvailability(data: any): void {
    const list2 = (this.events?.map((d: any) => {
      if (d.id == null) {
        return 0;
      }
      else {
        return d.start.getDay();
      }
    }));
    const map = new Map<number, number>();
    list2.forEach((day: any) => {
      if (day !== 0){
        if (map.has(day)){
          map.set(day, (map.get(day) || 0) + 1);
        }else{
          map.set(day, 1);
        }
      }
    });

    data.allEvent = this.events;
    data.availabilityCount = map;

    const interviewerAvailabilityModal = this.dialog.openAddUpdateAvailabilityDialog(data);
    this.op = data.op;
    this.event = data.event;
    this.allEvent = data.allEvent;
    interviewerAvailabilityModal.afterClosed().subscribe((result) => {

      if (result === true || result === false){
        this.ngOnInit();
      }
      if (!this.isTwoHoursGap){
        return;
      }

      const obj: any = {
        startTime: result.value.startTime,
        endTime: result.value.endTime
      };



      if (this.checkAvailabilityExists(result.value, this.events)) {
        if (this.event) {
          this.notifyService.showError('Your updated availability conflict with other availabilities of today', 'Failed');
        } else {
          this.notifyService.showError('Your added availability conflict with other availabilities of today', 'Failed');
        }
        return;
      }

      this.addList.push(result);
      this.tempEvents.push(
        {
          title: '',
          start: addMinutes(addHours(startOfDay(addDays(this.viewDate, (result.value.weekDay) - 1)),
            result.value.startTime.split(':')[0]), result.value.startTime.split(':')[1]),
          end: addMinutes(addHours(startOfDay(addDays(this.viewDate, (result.value.weekDay) - 1)),
          result.value.endTime.split(':')[0]), result.value.endTime.split(':')[1]),
          color: colors.yellow,
        }
      );
      this.ngOnInit();
    });
  }

checkAvailabilityExists(checker: any, checkList: any): boolean {
    if (this.event) {
      checker.weekDay = this.event.weekDay;
    }
    let filterList = checkList?.filter((check: any) => (Number(check.start.getDay()) === Number(checker.weekDay)) &&
      ((moment(checker.startTime, 'HH:mm').isBetween(moment(check.start.getHours() + ':' + check.start.getMinutes(), 'HH:mm'),
       moment(check.end.getHours() + ':' + check.end.getMinutes(), 'HH:mm'))
        || moment(checker.startTime, 'HH:mm').isSame(moment(check.start.getHours() + ':' + check.start.getMinutes(), 'HH:mm'))) ||
        (moment(checker.endTime, 'HH:mm').isBetween(moment(check.start.getHours() + ':' + check.start.getMinutes(), 'HH:mm'),
         moment(check.end.getHours() + ':' + check.end.getMinutes(), 'HH:mm'))
          || moment(checker.endTime, 'HH:mm').isSame(moment(check.end.getHours() + ':' + check.end.getMinutes(), 'HH:mm')))
          || (
            moment(checker.startTime, 'HH:mm').isBefore(moment(check.start.getHours() + ':' + check.start.getMinutes(), 'HH:mm')) &&
            moment(checker.endTime, 'HH:mm').isAfter(moment(check.end.getHours() + ':' + check.end.getMinutes(), 'HH:mm'))
          )
    ));

    if (this.event) {
      filterList = filterList.filter((a: any) => a.id !== this.event.id);
    }
    return filterList?.length > 0 ? true : false;

  }

  onSave(): void {
    const set = new Set(this.events?.map((d: any) => {
      return d.start.getDay();
    }));
    if (set.size < 3){
      this.notifyService.showError('Please add availability for atleast 3 days', 'Failed');
      this.minDayError = true;
      return;
    }else{
      this.minDayError = false;
    }
    this.addList.forEach((form: any) => {
      if (!this.isTwoHoursGap){
        return;
      }
      let obj: any = {
        startTime: form.value.startTime,
        endTime: form.value.endTime
      };
      if (this.event) {
        obj = { ...obj, id: this.event.id };
      }
      else {
        obj = { ...obj, day: form.value.weekDay };
      }
      if (this.op === 'add') {
        this.availabilityService.addAvailability(obj).subscribe(
          (response: any) => {
            if (response.response) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.onClear();
            } else {
              this.notifyService.showError(response.message, 'Failed');
            }
          },
          error => {
            this.notifyService.showError('Something went wrong!!!', 'Failed');
          }
        );
    }
  });
  }

  onClear(): void {
    this.tempEvents = [];
    this.addList = [];
    this.ngOnInit();
  }

  eventClicked(event: CalendarEvent): void {
    const weekDay = Number(event.start.getDay());
    const startTime = String(format(event.start.getTime(), 'HH:mm:ss'));
    const endTime = String(format(event.end ? event.end.getTime() : new Date(), 'HH:mm:ss'));
    const obj = this.allAvailability.filter((iEvent: any) => (
      iEvent.startTime === startTime &&
      iEvent.endTime === endTime && iEvent.weekDay === weekDay))[0];
    if (!obj){
        this.notifyService.showError('Cannot update availability until it is saved', 'Failed');
        return;
      }
    this.addMyAvailability({ op: 'edit', event: obj, allEvent: this.allAvailability });
  }
}

