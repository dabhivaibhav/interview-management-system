import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InterviewerService } from '../../service/interviewer.service';
import { Interviewer } from '../../model/Interviewer.model';
import { NotificationService } from 'src/app/notification.service';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-add-update-interviewer',
  templateUrl: './add-update-interviewer.component.html',
  styleUrls: ['./add-update-interviewer.component.css']
})
export class AddUpdateInterviewerComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUpdateInterviewerComponent>,
    private interviewerService: InterviewerService,
    private notifyService: NotificationService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.message > 0) {
      this.isDisabled = true;
    }
    this.form = new FormGroup({
      firstName: new FormControl(
        this.interviewer.firstName || '',
        [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.namePattern)]),
      lastName: new FormControl(
        this.interviewer.lastName || '',
        [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.namePattern)]),
      email: new FormControl(
        this.interviewer.email || '',
        [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.emailPattern)]),
      password: new FormControl(
        { value: this.interviewer.password || '', disabled: this.isDisabled },
        [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.passwordPattern)]),
      confPassword: new FormControl(
        { value: this.interviewer.confPassword || '', disabled: this.isDisabled },
        [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.passwordPattern)]),
      designation: new FormControl('', [Validators.required]),
      yoe: new FormControl(
        this.interviewer.yoe || '',
        [Validators.required, Validators.pattern(this.yoePattern)]),
      userRole: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
    });
  }

  isLoading = false;
  interviewer: Interviewer = new Interviewer();
  availability = true;
  errorMessage = '';
  startTime !: Date;
  endTime !: Date;
  currStartTime !: Date;
  currEndTime !: Date;
  isDisabled = false;

  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;
  passwordPattern: RegExp = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\\[\\]{}:;\',?/*~$^+=<>]).{8,20}$');
  yoePattern: RegExp = /^(?!0(\.0{1,2})?$)\d+(\.(0[0-9]|1[0-1]))?$|^(?!0(\.0{1,2})?$)\d+(\.[0-1])?$/;
  namePattern: RegExp = /^[a-zA-Z]{2,}$/;

  roles: any = [];
  departments: any = [];
  designationList: any = [];

  form: any;

  ngOnInit(): void {
    this.getRolesForInterviewers();
    this.getDesignationList();
    this.getDepartmentList();
    if (this.data.message > 0) {
      this.getInterviewerById(this.data.message);
    }
    this.availability = (this.data.message === 0 ? false : true);

    this.fc.yoe.valueChanges.subscribe((val: any) => {
      const input = String(val);
      const decimalIndex = input.indexOf('.');
      if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
        this.fc.yoe.patchValue(input.substring(0, decimalIndex + 3));
      }
    });
  }

  getRolesForInterviewers(): void {
    this.commonService.getRoleList().subscribe((response: any) => {
      if (response.response) {
        this.roles = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
        this.errorMessage = response.message;
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
      this.errorMessage = 'Something went wrong!! try later';
    });
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getInterviewerById(empId: number): void {
    this.isLoading = true;
    this.interviewerService.getInterviewerById(empId).subscribe((response: any) => {
      if (response.response) {
        this.interviewer = response.data;
        this.form.patchValue(this.interviewer);
        this.form.patchValue({ userRole: this.interviewer.role?.type });
        this.form.controls.designation.setValue(this.interviewer.designation?.id || '');
        this.form.controls.department.setValue(this.interviewer.department?.id || '');
      }
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!', 'Error');
    });
  }

  checkPassword(): void {
    const password = this.form.value.password;
    const confirmPassword = this.form.value.confPassword;

    if (!confirmPassword) {
      this.form.controls.confPassword.setErrors({ required: true });
    } else if (confirmPassword.indexOf(' ') >= 0) {
      this.form.controls.confPassword.setErrors({ noSpaceAllowed: true });
    } else if (confirmPassword && !this.passwordPattern.test(confirmPassword)) {
      this.form.controls.confPassword.setErrors({ pattern: true });
    } else if (password !== confirmPassword) {
      this.form.controls.confPassword.setErrors({ incorrect: true });
    } else {
      this.form.controls.confPassword.setErrors(null);
    }
  }

  submitInterviewerForm(): void {
    let body;
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    } else {
      this.interviewer = this.form.value;
      body = {
        firstName: this.form.value.firstName?.trim(),
        lastName: this.form.value.lastName?.trim(),
        email: this.form.value.email?.trim(),
        designation: this.form.value.designation,
        yoe: Number(this.form.value.yoe)?.toFixed(2),
        role: this.form.value.userRole,
        department: this.form.value.department
      };

      if (this.data.message === 0) {
        body = { ...body, password: this.form.value.password };
        if (!this.form.valid || this.interviewer.password !== this.interviewer.confPassword) {
          this.form.markAllAsTouched();
          if (this.interviewer.password !== this.interviewer.confPassword) {
            this.form.get('confPassword').markAsTouched();
            this.form.controls.confPassword.setErrors({ incorrect: true });
          }
        }
        else {
          this.isLoading = true;
          this.interviewerService.registerInterviewer(body).subscribe((response: any) => {
            if (response.response) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.dialogRef.close(response.data);
            } else {
              this.notifyService.showError(response.message, 'Error');
              this.errorMessage = response.message;
            }
            this.isLoading = false;
          }, (error) => {
            this.isLoading = false;
            this.notifyService.showError('Something went wrong!! try later', 'Error');
            this.errorMessage = 'Something went wrong!! try later';
          });
        }
      }
      else {
        this.interviewer.id = this.data.message;
        this.isLoading = true;
        this.interviewerService.updateInterviewer(body).subscribe((response: any) => {
          if (response.response) {
            this.notifyService.showSuccess(response.message, 'Success');
            this.dialogRef.close(response.data);
          } else {
            this.notifyService.showError(response.message, 'Error');
            this.errorMessage = response.message;
          }
          this.isLoading = false;
        }, (error) => {
          this.isLoading = false;
          this.notifyService.showError('Something went wrong!! try later', 'Error');
          this.errorMessage = 'Something went wrong!! try later';
        });
      }
    }
  }

  preventNumericInput(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    const isLetter = (key >= 'a' && key <= 'z');
    if (!(
      (event.code === 'Space') ||
      (event.code === 'Backspace') ||
      (event.code === 'Tab')) && !isLetter) {
      event.preventDefault();
    }
  }

  limitDecimalDigits(event: any): void {
    const input = event.target.value;
    const decimalIndex = input.indexOf('.');
    if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
      event.target.value = input.substring(0, decimalIndex + 3);
    }
  }

  getDesignationList(): void {
    this.commonService.getDesignationList().subscribe((response: any) => {
      if (response.response) {
        this.designationList = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

  getDepartmentList(): void {
    this.commonService.getDepartmentList().subscribe((response: any) => {
      if (response.response) {
        this.departments = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

}
