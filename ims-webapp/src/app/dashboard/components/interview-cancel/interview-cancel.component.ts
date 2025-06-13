import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InterviewService } from '../../service/interview.service';
import { NotificationService } from 'src/app/notification.service';
import { NameWhiteSpace } from 'src/app/name-white-space';

@Component({
  selector: 'app-interview-cancel',
  templateUrl: './interview-cancel.component.html',
  styleUrls: ['./interview-cancel.component.css']
})
export class InterviewCancelComponent implements OnInit {

  isLoading = false;
  cancelInterviewForm = new FormGroup({
    cancelReason: new FormControl('', [Validators.required, NameWhiteSpace.noSpaceAllowed])
  });
  constructor(
    private notificationService: NotificationService,
    private interviewService: InterviewService,
    private dialogRef: MatDialogRef<InterviewCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public get fc(): {[key: string]: AbstractControl} {
    return this.cancelInterviewForm?.controls;
  }

  cancelInterview(): void {
    if (!this.cancelInterviewForm.valid || this.fc.cancelReason.value.trim() === '') {

      return;
    }
    const cancelRequest = {
      interviewId: this.data,
      cancelReason: this.fc.cancelReason.value.trim()
    };
    this.interviewService.cancelInterview(cancelRequest).subscribe((res: any) => {
      if (res) {
        if (res.response) {
          console.log(res);
          console.log('Interview cancelled successfully..!!');
          this.notificationService.showSuccess(res.message, 'Success');
        } else {
          this.notificationService.showError(res.message, 'Error');
        }
        this.dialogRef.close(true);
      }
    });
  }
}
