import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AvailabilityService } from '../../service/availability.service';
import { DialogService } from '../../service/dialog.service';
import { NotificationService } from 'src/app/notification.service';
import { addHours } from 'date-fns';
import * as moment from 'moment';
import { ScheduledAtValidator } from '../../validator/scheduledAt.validator';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-update-availability',
  templateUrl: './add-update-availability.component.html',
  styleUrls: ['./add-update-availability.component.css']
})
export class AddUpdateAvailabilityComponent implements OnInit {

  op !: string;
  event: any;
  allEvent: any;
  startTime !: Date;
  endTime !: Date;
  currStartTime !: Date;
  currEndTime !: Date;
  isLoading = false;
  availability = false;
  errorMsg = '';
  isTwoHoursGap = true;
  minDayError = false;
  availabilityCount = new Map<number, number>();
  days = [
    {
      id: 1,
      weekDay: 'Monday'
    },
    {
      id: 2,
      weekDay: 'Tuesday'
    },
    {
      id: 3,
      weekDay: 'Wednesday'
    },
    {
      id: 4,
      weekDay: 'Thursday'
    },
    {
      id: 5,
      weekDay: 'Friday'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private availabilityService: AvailabilityService,
    public dialogRef: MatDialogRef<AddUpdateAvailabilityComponent>,
    private dialogService: DialogService,
    private notifyService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.minDayError = data.minDayError;
    this.op = data.op;
    this.event = data.event;
    this.allEvent = data.allEvent;
    this.availabilityCount = data.availabilityCount;
    if (this.event) {
      this.form.patchValue({
        startTime: this.event.startTime,
        endTime: this.event.endTime,
        weekDay: this.days[this.event.weekDay - 1]?.weekDay
      });
    }
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  form: FormGroup = this.fb.group({
    startTime: new FormControl('09:00', [Validators.required, ScheduledAtValidator.ScheduledAtValidation]),
    endTime: new FormControl('18:00', [Validators.required, ScheduledAtValidator.ScheduledAtValidation]),
    weekDay: new FormControl(null, [Validators.required])
  });


  ngOnInit(): void {
  }



  deleteAvailability(): void {
    this.dialogService.openDeleteDialog('availability').afterClosed().subscribe(
      (res: any) => {
        if (this.data.availabilityCount.get(this.event.weekDay) === 1){
          if (this.availabilityCount.size - 1 < 3){
            res = false;
            this.notifyService.showError('You cannot delete this availability, as you must have availibility for at least 3 days',
             'Failed');
            this.dialogRef.close(true);
          }
        }
        if (res) {
          this.availabilityService.deleteAvailability(this.event?.id).subscribe((response: any) => {
            if (response.response === true) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.dialogRef.close(true);
            }
            else {
              this.notifyService.showError(response.message, 'Failed');
            }
          }, (error: any) => {
            this.notifyService.showError('Something went wrong..!! try later', 'Failed');
            console.log(error);
          });
          this.isLoading = false;
        }
      }
    );
  }

  checkTime(str: string): void {
    const startTime = moment(this.form.value.startTime, 'HH:mm');
    const endTime = moment(this.form.value.endTime, 'HH:mm');
    const duration = moment.duration(endTime.diff(startTime));
    if (startTime && startTime.isAfter(endTime)) {
      str === 'startTime' ?
        this.fc.startTime.setErrors({ ...this.fc.startTime.errors, timeInvalid: true }) :
        this.fc.endTime.setErrors({ ...this.fc.endTime?.errors, timeInvalid: true });
    }
    else {
      if (this.fc.startTime.errors){
        delete this.fc.startTime.errors.timeInvalid;
      }
      if (this.fc.endTime.errors){
        delete this.fc.endTime.errors.timeInvalid;
      }
    }

    if (duration.asHours() < 2){
this.isTwoHoursGap = false;
    }else{
      this.isTwoHoursGap = true;
    }
  }

  checkAvailabilityExists(checker: any, checkList: any): boolean {
    if (this.event) {
      checker.weekDay = this.event.weekDay;
    }
    let filterList: any;
    if (this.event) {
      filterList = checkList?.filter((check: any) => (Number(check.start.getDay()) === Number(checker.weekDay)) &&
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
    }else{
      filterList = checkList?.filter((check: any) => (Number(check.weekDay) === Number(checker.weekDay)) &&
        ((moment(checker.startTime, 'HH:mm').isBetween(moment(check.startTime, 'HH:mm'), moment(check.endTime, 'HH:mm'))
          || moment(checker.startTime, 'HH:mm').isSame(moment(check.startTime, 'HH:mm'))) ||
          (moment(checker.endTime, 'HH:mm').isBetween(moment(check.startTime, 'HH:mm'), moment(check.endTime, 'HH:mm'))
            || moment(checker.endTime, 'HH:mm').isSame(moment(check.endTime, 'HH:mm'))))

      );
    }
    if (this.event) {
      filterList = filterList.filter((a: any) => a.id !== this.event.id);
    }
    return filterList?.length > 0 ? true : false;
  }

  submitAvailabilityForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.isTwoHoursGap){
      return;
    }
    let obj: any = {
      startTime: this.form.value.startTime,
      endTime: this.form.value.endTime
    };

    if (this.checkAvailabilityExists(this.form.value, this.allEvent)) {
      if (this.event) {
        this.notifyService.showError('Your updated availability conflict with other availabilities of today', 'Failed');
      } else {
        this.notifyService.showError('Your added availability conflict with other availabilities of today', 'Failed');
      }
      return;
    }
    if (this.event) {
      obj = { ...obj, id: this.event.id };
    }
    else {
      obj = { ...obj, day: this.form.value.weekDay };
    }
    if (this.op === 'add') {
      this.dialogRef.close(this.form);
    }
    else {
      this.availabilityService.updateAvailability(obj).subscribe(
        (response: any) => {
          if (response.response) {
            this.notifyService.showSuccess(response.message, 'Success');
            this.dialogRef.close(true);
          } else {
            this.notifyService.showError(response.message, 'Failed');
          }
        },
        error => {
          this.notifyService.showError('Something went wrong!!!', 'Failed');
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
