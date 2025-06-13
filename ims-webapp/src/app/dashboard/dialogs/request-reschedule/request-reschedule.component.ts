import { Component, Inject, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import * as moment from 'moment';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { InterviewService } from '../../service/interview.service';
import { ScheduledAtValidator } from '../../validator/scheduledAt.validator';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-request-reschedule',
  templateUrl: './request-reschedule.component.html',
  styleUrls: ['./request-reschedule.component.css']
})
export class RequestRescheduleComponent implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private interviewService: InterviewService,
    private dialogRef: MatDialogRef<RequestRescheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  public get fc(): {[key: string]: AbstractControl} {
    return this.requestRescheduleForm?.controls;
  }
  minDate: Date = new Date();

  requestRescheduleForm = new FormGroup({
    reschedulingReason: new FormControl('', [Validators.required, NameWhiteSpace.noSpaceAllowed]),
    scheduledAt: new FormControl('09:00', [Validators.required, ScheduledAtValidator.ScheduledAtValidation]),
    interviewDate : new FormControl(new Date())
  });

  filteredDate = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  ngOnInit(): void {
  }

  requestReschedule(): void {
    if (!this.requestRescheduleForm.valid || this.fc.reschedulingReason.value.trim() === '') {
      return;
    }
    const newarr = this.fc.scheduledAt.value.split(':');
    const date =  new Date(this.fc.interviewDate.value);
    date.setHours(newarr[0]);
    date.setMinutes(newarr[1]);
    const rescheduleRequest = {
      interviewId: this.data.id,
      rescheduleReason: this.fc.reschedulingReason.value.trim(),
      interviewTime : this.fc.scheduledAt.value,
      interviewDate : date
    };
    this.interviewService.requestReschedule(rescheduleRequest).subscribe((res: any) => {
      if (res) {
        if (res.response) {
          this.notificationService.showSuccess(res.message, 'Success');
        } else {
          this.notificationService.showError(res.message, 'Error');
        }
        this.dialogRef.close(true);
      }
    });
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  dateValidator(data: any): void {
    const updatedDate = data.targetElement.value ? data.targetElement.value : moment(new Date()).format('DD/MM/YYYY');
    const [day, month, year] = updatedDate.split('/').map(Number);
    const createdDate = new Date(year, month - 1, day);
    this.requestRescheduleForm.patchValue({ interviewDate: createdDate });
  }
}
