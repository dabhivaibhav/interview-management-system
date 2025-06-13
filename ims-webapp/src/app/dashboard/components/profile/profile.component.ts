import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Interviewer } from '../../model/Interviewer.model';
import { InterviewerService } from '../../service/interviewer.service';
import { PassowrdMatchValidator } from '../../validator/password-match.validator';
import { NotificationService } from 'src/app/notification.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;
  yoePattern: RegExp = /^\d+(\.(0[0-9]|1[0-1]))?$|^\d+(\.[0-1])?$/;
  passwordPattern: RegExp = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\\[\\]{}:;\',?/*~$^+=<>]).{8,20}$');
  namePattern: RegExp = /^[a-zA-Z ]{2,}$/;

  interviewer: Interviewer = new Interviewer();
  currentPasswordHide = true;
  newPasswordHide = true;
  confirmPasswordHide = true;
  isDisabled = true;
  designationList: any = [];
  form: any = new FormGroup({
    firstName: new FormControl(
      this.interviewer.firstName || '',
      [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.namePattern)]),
    lastName: new FormControl(
      this.interviewer.lastName || '',
      [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.namePattern)]),
    email: new FormControl(
      { value: this.interviewer.email || '', readonly: true },
      [Validators.required, Validators.pattern(this.emailPattern)]),
    role: new FormControl({
      value: '' || this.interviewer.role?.type, readonly: true
    }),
    designation: new FormControl({
      value: '' || this.interviewer.designation?.designationName, readonly: true
    }),
    yoe: new FormControl(
      this.interviewer.yoe || '',
      [Validators.required, Validators.pattern(this.yoePattern)]),
  });
  passwordForm: any = new FormGroup({
    currentPassword: new FormControl(
      '',
      [Validators.required, Validators.pattern(this.passwordPattern)]),
    newPassword: new FormControl(
      '',
      [Validators.required, Validators.pattern(this.passwordPattern)]),
    confirmPassword: new FormControl(
      '',
      [Validators.required, Validators.pattern(this.passwordPattern)])
  });


  constructor(
    private interviewerService: InterviewerService,
    private notifyService: NotificationService,
    private sidebar: SidebarComponent,
    private commonService: CommonService
  ) { this.getInterviewer(); }

  ngOnInit(): void {
    this.getDesignationList();
    this.fc.yoe.valueChanges.subscribe((val: any) => {
      const input = String(val);
      const decimalIndex = input.indexOf('.');


      if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
        this.fc.yoe.patchValue(input.substring(0, decimalIndex + 3));
      }
    });
  }
  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get pFC(): { [key: string]: AbstractControl } {
    return this.passwordForm.controls;
  }
  getInterviewer(): void {

    this.interviewerService.getInterviewer().subscribe((response: any) => {
      if (response.response) {
        const data = { ...this.interviewer, ...response.data };
        this.interviewer = data;
        this.form.controls.designation.setValue(this.interviewer.designation?.designationName || '');
        this.form.patchValue({
          role: this.interviewer.role?.type || '',
          firstName: this.interviewer.firstName || '',
          lastName: this.interviewer.lastName || '',
          email: this.interviewer.email || '',
          yoe: this.interviewer.yoe || 0,
        });
      }
      else {
        this.notifyService.showError(response.message, 'Failed');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Failed');
      console.log(error);
    });
  }

  editInterviewer(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const body = {
        firstName: this.fc.firstName.value.trim(),
        lastName: this.fc.lastName.value.trim(),
        yoe: this.fc.yoe.value
      };
      this.interviewerService.editInterviewerDetails(body).subscribe((response: any) => {
        if (response.response) {
          this.notifyService.showSuccess(response.message, 'Success');
          localStorage.setItem('userName', `${response.data.firstName} ${response.data.lastName}`);
          this.sidebar.ngOnInit();
        }
        else {
          this.notifyService.showError(response.message, 'Failed');
        }
      }, (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      });
    }
  }

  submitPassword(): void {
    if (!this.passwordForm.valid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const body = this.passwordForm.value;
      this.interviewerService.editInterviewerPassword(body).subscribe((response: any) => {
        if (response.response) {
          this.notifyService.showSuccess(response.message, 'Success');
          this.passwordForm.reset();
          Object.keys(this.passwordForm.controls).forEach(key => {
            this.passwordForm.get(key).setErrors(null);
          });
        }
        else {
          this.notifyService.showError(response.message, 'Failed');
        }
      }, (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      });
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

  checkPassword(): void {
    const password = this.passwordForm.value.newPassword;
    const confirmPassword = this.passwordForm.value.confirmPassword;

    if (!confirmPassword) {
      this.passwordForm.controls.confirmPassword.setErrors({ required: true });
    } else if (confirmPassword.indexOf(' ') >= 0) {
      this.passwordForm.controls.confirmPassword.setErrors({ noSpaceAllowed: true });
    } else if (confirmPassword && !this.passwordPattern.test(confirmPassword)) {
      this.passwordForm.controls.confirmPassword.setErrors({ pattern: true });
    } else if (password !== confirmPassword) {
      this.passwordForm.controls.confirmPassword.setErrors({ incorrect: true });
    } else {
      this.passwordForm.controls.confirmPassword.setErrors(null);
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
}
