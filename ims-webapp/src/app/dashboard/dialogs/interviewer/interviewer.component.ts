import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { InterviewerService } from '../../service/interviewer/interviewer.service';
import { NotificationService } from 'src/app/notification.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InterviewService } from '../../service/interview.service';
import { AddUpdateInterviewerComponent } from '../add-update-interviewer/add-update-interviewer.component';
import { AddUpdateInterviewComponent } from '../add-update-interview/add-update-interview.component';

@Component({
  selector: 'app-interviewer',
  templateUrl: './interviewer.component.html',
  styleUrls: ['./interviewer.component.css']
})
export class InterviewerComponent implements OnInit {

  interviewerForm = new FormGroup({
    interviewer: new FormControl('', [Validators.required])
  });
  interviewers: any[] = [];
  interviewerList: string[] = [];
  constructor(
    private interviewerService: InterviewerService,
    private notifyService: NotificationService,
    private interviewService: InterviewService,
    private dialogRef: MatDialogRef<AddUpdateInterviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.interviewers = this.data.data;
    this.interviewers = this.interviewers.filter(element => element.id !== this.data.interviewerId);
    this.interviewerList = this.interviewers?.map(((interviewer: any) => {
      return `${interviewer.firstName} ${interviewer.lastName}(${interviewer.email})`;
    }));

    if (this.data.selectedInterviewer > 0){
      this.fc.interviewer.patchValue(this.data.selectedInterviewer);
    }
  }

  get fc(): { [key: string]: AbstractControl }  {
    return this.interviewerForm?.controls;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void{
    const interviewer =  this.interviewers.filter(element => this.fc.interviewer.value === element.id);
    this.dialogRef.close(interviewer);
  }

}
