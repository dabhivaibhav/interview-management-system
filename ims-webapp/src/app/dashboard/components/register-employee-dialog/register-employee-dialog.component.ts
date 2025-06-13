import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Interviewer } from '../../model/Interviewer.model';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { InterviewerService } from '../../service/interviewer.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { CommonService } from '../../service/common/common.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-register-employee-dialog',
  templateUrl: './register-employee-dialog.component.html',
  styleUrls: ['./register-employee-dialog.component.css']
})
export class RegisterEmployeeDialogComponent implements OnInit {
  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;
  passwordPattern: RegExp = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\\[\\]{}:;\',?/*~$^+=<>]).{8,20}$');
  yoePattern: RegExp = /^\d+(\.(0[0-9]|1[0-1]))?$|^\d+(\.[0-1])?$/;
  interviewer: Interviewer = new Interviewer();
  isAdd: boolean = (this.interviewer.id > 0) ? true : false;
  errorMessage = '';
  hide = true;
  roles: any = [];
  form: any = new FormGroup({
    firstName: new FormControl(this.interviewer.firstName || '', [Validators.required]),
    lastName: new FormControl(this.interviewer.lastName || '', [Validators.required]),
    email: new FormControl(this.interviewer.email || '', [Validators.required, Validators.pattern(this.emailPattern)]),
    password: new FormControl(this.interviewer.password || '', [Validators.required, Validators.pattern(this.passwordPattern)]),
    designation: new FormControl(this.interviewer.designation || ''),
    yoe: new FormControl(this.interviewer.yoe || '0.0', Validators.pattern(this.yoePattern)),
    userRole: new FormControl(this.interviewer.type || this.roles[0].key)
  });

  constructor(
    private employeeService: InterviewerService,
    private dialogRef: MatDialogRef<RegisterEmployeeDialogComponent>,
    private commonService: CommonService,
    private notifyService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { interviewer: Interviewer }) {
    if (data.interviewer.id > 0) {
      this.interviewer = this.data.interviewer;
      this.form.patchValue(this.interviewer);
    }
  }

  ngOnInit(): void {
    this.getRolesForInterviewers();
  }

  getRolesForInterviewers(): void {
    this.commonService.getRoleList().subscribe((response: any) => {
      if (response.response) {
        this.roles =  response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
        this.errorMessage = response.message;
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
      this.errorMessage = 'Something went wrong!! try later';
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  registerEmployee(): void {
    this.interviewer = this.form.value;
    this.employeeService.registerInterviewer(this.interviewer).subscribe((response: any) => {
      if (response.response) {
        this.dialogRef.close(response.data);
      } else {
        this.errorMessage = response.message;
      }
    }, (error) => {
      this.errorMessage = 'Something went wrong!! try later';
      console.log(error);
    });
  }
}
