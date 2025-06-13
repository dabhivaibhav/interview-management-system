import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/notification.service';
import { InterviewFeedbackService } from '../../interview-feedback.service';
import { InterviewFeedback } from '../../model/InterviewFeedback.model';
import { NameWhiteSpace } from 'src/app/name-white-space';

@Component({
  selector: 'app-interview-feedback',
  templateUrl: './interview-feedback.component.html',
  styleUrls: ['./interview-feedback.component.css']
})
export class InterviewFeedbackComponent implements OnInit {

  ratingPattern: RegExp = /\b(?:[1-9]|10)\b/;

  interviewFeedbackForm: FormGroup = new FormGroup({
    comments: new FormControl(''),
    status: new FormControl('', [Validators.required]),
    ceoRoundRequired: new FormControl('YES'),
    frontendScore: new FormControl('', [Validators.required, Validators.pattern(this.ratingPattern)]),
    backendScore: new FormControl('', [Validators.required, Validators.pattern(this.ratingPattern)]),
    communicationScore: new FormControl('', [Validators.required, Validators.pattern(this.ratingPattern)]),
    databaseScore: new FormControl('', [Validators.required, Validators.pattern(this.ratingPattern)]),
    file: new FormControl('')
  });
  isWrongFile = false;
  isLoading = false;
  viewFeedback = false;
  uploadedfile: File | any = [];
  fileName: string | undefined = '';
  isVideoPresent = false;

  constructor(
    private notificationService: NotificationService,
    private interviewFeedbackService: InterviewFeedbackService,
    private dialogRef: MatDialogRef<InterviewFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.status === 'SELECTED' || this.data.status === 'NOT_SELECTED') {
      this.viewFeedback = true;
      this.viewFeedbackData();

    }
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  public get fc(): {[key: string]: AbstractControl} {
    return this.interviewFeedbackForm?.controls;
  }

  feedbackInterview(): void {
    if (!this.interviewFeedbackForm.valid) {
      return;
    }
    const interviewFeedbackReq = new InterviewFeedback();
    interviewFeedbackReq.convertFormDataToJson(this.interviewFeedbackForm.value);
    interviewFeedbackReq.interviewId = this.data.id;
    interviewFeedbackReq.type = this.data.roundType.roundType;
    interviewFeedbackReq.fileName = this.fileName;
    if (this.interviewFeedbackForm.value.ceoRoundRequired === null || this.interviewFeedbackForm.value.ceoRoundRequired === 'YES'){
      interviewFeedbackReq.ceoRoundRequired = 'YES';
    }
    else{
      interviewFeedbackReq.ceoRoundRequired = 'NO';
    }

    const formData = new FormData();
    formData.append('interviewFeedback', this.convertJsonToBinary(interviewFeedbackReq));
    formData.append('file', this.uploadedfile);

    this.interviewFeedbackService.addInterviewFeedback(formData).subscribe((res: any) => {
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

  viewFeedbackData(): void {
    this.interviewFeedbackService.getInterviewFeedback(this.data.id).subscribe((response: any) => {
      if (response.response) {
        this.fileName = response.data.fileName;
        this.interviewFeedbackForm.patchValue(response.data);
        this.isVideoPresent = response.data.videoPresent;
      }
      else {
        this.notificationService.showError(response.message, 'Failed');
      }
    }, (error: any) => {
      this.notificationService.showError('Something went wrong!! try later', 'Failed');
    });
  }

  onFileSelected(event: any): void {
    this.uploadedfile = event.target.files[0];
    const acceptedExtensions = ['video/webm'];
    if (acceptedExtensions.includes(this.uploadedfile.type)) {
      this.fileName = this.uploadedfile.name;
      this.isWrongFile = false;
    } else {
      this.uploadedfile = File;
      this.remove();
      this.isWrongFile = true;
    }
  }


  convertJsonToBinary(jsonData: any): Blob {
    const jsonString = JSON.stringify(jsonData);
    const binaryData = new Blob([jsonString], { type: 'application/json' });
    return binaryData;
  }


  remove(): void {
    this.fileName = undefined;
    this.uploadedfile = File;
    this.interviewFeedbackForm.patchValue({ file: '' });
    this.interviewFeedbackForm.controls.file.setErrors({ required: true });
  }

}
