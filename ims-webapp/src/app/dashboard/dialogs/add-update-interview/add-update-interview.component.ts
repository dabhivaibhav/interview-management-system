import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map, pairwise, startWith } from 'rxjs/operators';
import { InterviewerService } from '../../service/interviewer/interviewer.service';
import * as moment from 'moment';
import { ScheduledAtValidator } from '../../validator/scheduledAt.validator';
import { InterviewService } from '../../service/interview.service';
import { NotificationService } from 'src/app/notification.service';
import { IntervieweeService } from '../../service/interviewee.service';
import { DialogService } from '../../service/dialog.service';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-add-update-interview',
  templateUrl: './add-update-interview.component.html',
  styleUrls: ['./add-update-interview.component.css']
})
export class AddUpdateInterviewComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private dialog: DialogService,
    private notifyService: NotificationService,
    private interviewService: InterviewService,
    private intervieweeService: IntervieweeService,
    private interviewerService: InterviewerService,
    private dialogRef: MatDialogRef<AddUpdateInterviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getAllInterviewee();

    this.form.valueChanges.
    pipe(
      startWith(this.form.value),
      pairwise(),
      debounceTime(300)
    )
    .subscribe(([oldValue, newValue]: any) => {
      if (
        oldValue.interviewee !== newValue.interviewee ||
        oldValue.scheduledAt !== newValue.scheduledAt ||
        oldValue.interviewDate !== newValue.interviewDate ||
        oldValue.roundType !== newValue.roundType) {
        this.interviewerId = 0;
        this.fc.interviewer.patchValue(null);
      }
    });
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  roundTypes: any = [];
  isInterviewerDeselected = false;
  isLoading = false;
  isIntervieweeAssignedInterview = false;
  interviewerList: string[] = [];
  intervieweeList: string[] = [];
  interviewees: any;
  interviewers: any;
  filteredInterviewee: Observable<string[]> | undefined;
  filteredInterviewer: Observable<string[]> | undefined;
  errorMessage = '';

  form: any = new FormGroup({
    interviewee: new FormControl('', [Validators.required]),
    scheduledAt: new FormControl('09:00', [Validators.required, ScheduledAtValidator.ScheduledAtValidation]),
    interviewer: new FormControl({ value: '', disabled: false }, []),
    roundType: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    interviewDate: new FormControl(new Date())
  });
  duration = 0;
  minDate: Date = new Date();
  interviewerNotFoundMessage = false;
  interviewerAvailable = {
    status: true,
    message: ''
  };
  interviewerId = 0;

  filteredDate = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  ngOnInit(): void {
    this.getAllRoundType();
    this.filteredInterviewee = this.form.controls.interviewee.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterInterviewee(value || ''))
    );
    this.filteredInterviewer = this.form.controls.interviewer.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filterInterviewer(value || ''))
    );
    if (this.data) {
      this.fc.interviewee.disable();
      this.fc.interviewer.disable();
    }
  }

  dateValidator(data: any): void {
    const updatedDate = data.targetElement.value ? data.targetElement.value : moment(new Date()).format('DD/MM/YYYY');
    const [day, month, year] = updatedDate.split('/').map(Number);
    const createdDate = new Date(year, month - 1, day);
    this.form.patchValue({ interviewDate: createdDate });
  }

  private _filterInterviewer(value: string): any {
    const filterValue = String(value).toLowerCase();
    if (!filterValue) {
      return this.interviewerList;
    }
    return this.interviewerList?.filter((interviewer: any) => interviewer.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  private _filterInterviewee(value: string): any {
    const filterValue = String(value).toLowerCase();
    if (!filterValue) {
      return this.intervieweeList;
    }
    return this.intervieweeList?.filter((interviewee: any) => interviewee.toLowerCase().startsWith(filterValue.toLowerCase()));
  }

  setEmptyString(): void {
    if (this.fc.interviewee.value.length > 0) {
      return;
    }
    else {
      this.filteredInterviewee = this.form.controls.interviewee.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filterInterviewee(value || ''))
      );
    }
  }

  addInterview(): void {
    const intervieweeEmail = (this.fc.interviewee.value.match(/\(([^)]+)\)/) || [])[1] || null;
    const interviewDate = this.fc.interviewDate.value;
    const interviewTime = this.fc.scheduledAt.value;
    const combinedDateTime = moment(interviewDate).set({
      hour: parseInt(interviewTime.split(':')[0], 10),
      minute: parseInt(interviewTime.split(':')[1], 10),
    }).format('YYYY-MM-DDTHH:mm:ss');
    let isValid = true;
    const interviewee = this.interviewees?.filter((opt: any) => opt.email === intervieweeEmail);
    if (interviewee.length < 1) {
      this.fc.interviewee.setErrors({ intervieweeListValidation: true });
      isValid = false;
    }
    if (this.interviewerId < 1) {
      this.isInterviewerDeselected = true;
      isValid = false;
    }
    else {
      this.fc.interviewee.setErrors(null);
      isValid = true;
    }
    if (moment(combinedDateTime).isBefore(moment().add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss'))) {
      this.form.setErrors({ interviewerDateTimeValidation: true });
      isValid = false;
    }
    if (!this.form.valid || !isValid) {
      this.form.markAllAsTouched();
    }
    else {
      const round = this.roundTypes.find((s: any) => s.roundType === this.fc.roundType.value);
      const body = {
        scheduledAt: combinedDateTime,
        roundType: round.id,
        description: this.fc.description.value.trim(),
        duration: this.duration,
        intervieweeId: interviewee[0].id,
        interviewerId: this.interviewerId,
      };
      let isUpdate = false;
      if (this.data) {
        isUpdate = true;
      }
      this.isLoading = true;
      this.interviewService.scheduleInterview(body, isUpdate, this.data ? this.data.id : 0).subscribe((response: any) => {
        if (response.response) {
          this.notifyService.showSuccess(response.message, 'Success');
          this.dialogRef.close(true);
        }
        else {
          if (response.message.startsWith('Interview is already taken and possible after 6 months from') || response.message.startsWith('Interview is already scheduled')) {
            this.isIntervieweeAssignedInterview = true;
            this.errorMessage = response.message;
          }
          else {
            this.isIntervieweeAssignedInterview = false;
            this.notifyService.showError(response.message, 'Failed');
          }
        }
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!!!', 'Failed');
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  getAllRoundType(): void{
    this.commonService.getRoundList().subscribe((response: any) => {
      if (response.response) {
        this.roundTypes =  response.data;
        this.duration = this.roundTypes[0].duration;
        if (!this.data) {
          this.form.patchValue({roundType: this.roundTypes[0]?.roundType});
        }
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

  getAllInterviewee(): void {
    this.isLoading = true;
    this.intervieweeService.getAllInterviewee().subscribe((response: any) => {
      if (response.response) {
        this.interviewees = response.data;
        this.intervieweeList = this.interviewees?.map(((interviewee: any) => {
          return `${interviewee.name}(${interviewee.email})`;
        }));
        if (this.data) {
          const interviewee = this.interviewees?.filter((opt: any) => {
            return opt.id === this.data.intervieweeId;
          });
          const interviewer = this.data.interviewerFirstName + ' ' + this.data.interviewerLastName;
          const scheduleAt = moment(this.data.scheduledAt).format('HH:mm');
          const date = moment(this.data.scheduledAt).format('YYYY-MM-DD');
          this.duration = this.data.duration;
          const roundType = this.data.roundType.roundType;
          this.form.patchValue({interviewee: interviewee[0].name + '(' + interviewee[0].email + ')', interviewer ,
           interviewDate: date, scheduledAt: scheduleAt,  description: this.data.description, roundType});
        }
        this.isLoading = false;
      }
    }, (error) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

  changeDuration(event: any): void {
    const roundType = this.roundTypes.filter((rt: any) => {
      return rt.id === event ? true : false;
    });
    this.duration = Number(roundType[0].duration);
  }

  getAvailableInterviewer(): void {
    const intervieweeEmail = (this.fc.interviewee.value.match(/\(([^)]+)\)/) || [])[1] || null;
    const combinedDateTime = moment(this.fc.interviewDate.value).set({
      hour: parseInt(this.fc.scheduledAt.value.split(':')[0], 10),
      minute: parseInt(this.fc.scheduledAt.value.split(':')[1], 10),
    }).format('YYYY-MM-DDTHH:mm:ss');
    let isValid = true;
    const interviewee = this.interviewees?.filter((opt: any) => opt.email === intervieweeEmail);
    if (interviewee.length < 1) {
      this.fc.interviewee.setErrors({ intervieweeListValidation: true });
      isValid = false;
    }
    if (moment(combinedDateTime).isBefore(moment().add(4, 'hours').format('YYYY-MM-DDTHH:mm:ss'))) {
      this.form.setErrors({ interviewerDateTimeValidation: true });
      isValid = false;
    }
    if (!this.form.valid || !isValid) {
      this.form.markAllAsTouched();
    }
    else {
      const afterTime = moment('18:00', 'HH:mm');
      const startTime = this.fc.scheduledAt.value;
      const givenMoment = moment(startTime, 'HH:mm');
      givenMoment.add(this.duration, 'minutes');
      const endTime = givenMoment.format('HH:mm');
      const formattedDate = moment(this.fc.interviewDate.value).format('DD/MM/YYYY');
      const [day, month, year] = formattedDate.split('/').map(Number);
      const createdDate = new Date(year, month - 1, day + 1);
      const round = this.roundTypes.find((s: any) => s.roundType === this.fc.roundType.value);
      const body = {
        startTime,
        endTime,
        yoe: interviewee[0].yoe,
        localDate: createdDate,
        roundType: round.id,
        interviewId: this.data != null ? this.data.id : 0,
        intervieweeId: interviewee[0].id
      };
      if (givenMoment.isAfter(afterTime)) {
        this.fc.scheduledAt.setErrors({ endTimeExpire: true });
        return;
      }
      else {
        this.fc.scheduledAt.setErrors(null);
      }
      if (this.fc.scheduledAt.errors) {
        return;
      }
      this.isLoading = true;
      this.interviewerService.getAllAvailableInterviewers(body).subscribe((response: any) => {
        if (response.response) {
          this.interviewers = response.data;
          if (this.interviewers.length > 0) {
            this.interviewerAvailable.status = true;
            const intererviewModal = this.dialog.openInterviewerDialog({ data: response.data, selectedInterviewer: this.interviewerId });
            intererviewModal.afterClosed().subscribe((result) => {
              if (result) {
                this.interviewerAvailable.message = '';
                this.interviewerId = result[0].id;
                this.form.patchValue({ interviewer: `${result[0].firstName} ${result[0].lastName}(${result[0].email})` });
                this.isInterviewerDeselected = false;
              }
            });
          } else {
            this.interviewerAvailable.status = false;
            this.interviewerAvailable.message = 'No interviewer available right now!';
          }
          this.isLoading = false;
        }
        else{
          this.isLoading = false;
          this.notifyService.showError('Something went wrong!! try later', 'Error');
        }
      }, (error) => {
        this.isLoading = false;
        console.log(error);
      });
    }
  }
}
