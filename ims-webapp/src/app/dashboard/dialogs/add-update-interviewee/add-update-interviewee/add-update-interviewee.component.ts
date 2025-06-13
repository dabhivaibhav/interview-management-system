import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Interviewee } from 'src/app/dashboard/model/Interviewee';
import { NoticePeroidDropdownOption } from 'src/app/dashboard/model/NoticePeriodDropdownOption ';
import { CommonService } from 'src/app/dashboard/service/common/common.service';
import { IntervieweeService } from 'src/app/dashboard/service/interviewee.service';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-add-update-interviewee',
  templateUrl: './add-update-interviewee.component.html',
  styleUrls: ['./add-update-interviewee.component.css']
})
export class AddUpdateIntervieweeComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private intervieweeService: IntervieweeService,
    public dialogRef: MatDialogRef<AddUpdateIntervieweeComponent>,
    private notifyService: NotificationService,
    private commonService: CommonService
  ) { }

  availability = false;
  isRemoved = true;
  isLoading = false;
  uploadedfile: File | any;
  resume: string | undefined;
  isWrongFile = false;
  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;
  phoneNumberPattern: RegExp = /^\d{10}$/;
  decimalPattern: RegExp = /\d+(\.\d{1,2})?/;
  dayPattern: RegExp = /^[0-9]+()?$/;
  yoePattern: RegExp = /^\d+(\.(0[0-9]|1[0-1]))?$|^\d+(\.[0-1])?$/;
  interviewee: Interviewee = new Interviewee();
  namePattern: RegExp = /^[a-zA-Z']{1}[a-zA-Z' ]*[a-zA-Z']{1}$/;
  designationList: any = [];
  departmentList: any = [];
  noticePeriodOptions: NoticePeroidDropdownOption[] = NoticePeroidDropdownOption.getDefaultOptions();

  addorEditIntervieweeForm: any = new FormGroup({
    name: new FormControl(this.interviewee.name || '',
      [Validators.required, NameWhiteSpace.noSpaceAllowed, Validators.pattern(this.namePattern)]),
    email: new FormControl(this.interviewee.email || '', [Validators.required, Validators.pattern(this.emailPattern)]),
    phone: new FormControl(this.interviewee.phone || '', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
    currentCompany: new FormControl(this.interviewee.currentCompany || '',
      [Validators.required, NameWhiteSpace.noSpaceAllowed]),
    currentCTC: new FormControl(this.interviewee.currentCTC || '', [Validators.required, Validators.pattern(this.decimalPattern)]),
    expectedCTC: new FormControl(this.interviewee.expectedCTC || '', [Validators.required, Validators.pattern(this.decimalPattern)]),
    noticePeriod: new FormControl(this.interviewee.noticePeriod || '', [Validators.required]),
    yoe: new FormControl(this.interviewee.yoe || '', [Validators.required, Validators.pattern(this.yoePattern)]),
    file: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    if (this.data.id > 0) {
      this.uploadedfile = [];
      this.removeValidatorsForFile();
      this.setEditIntervieweePopupData(this.data.id);
      this.availability = true;
    }
    this.getDesignationList();
    this.getDepartmentList();
    this.addorEditIntervieweeForm.get('yoe').valueChanges.subscribe((val: any) => {
      const input = String(val);
      const decimalIndex = input.indexOf('.');


      if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
        this.addorEditIntervieweeForm.get('yoe').patchValue(input.substring(0, decimalIndex + 3));
      }
    });
    this.addorEditIntervieweeForm.get('currentCTC').valueChanges.subscribe((val: any) => {
      const input = String(val);
      const decimalIndex = input.indexOf('.');
      if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
        this.addorEditIntervieweeForm.get('currentCTC').patchValue(input.substring(0, decimalIndex + 3));
      }
    });
    this.addorEditIntervieweeForm.get('expectedCTC').valueChanges.subscribe((val: any) => {
      const input = String(val);
      const decimalIndex = input.indexOf('.');
      if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
        this.addorEditIntervieweeForm.get('expectedCTC').patchValue(input.substring(0, decimalIndex + 3));
      }
    });
  }

  removeValidatorsForFile = (): void => {
    this.addorEditIntervieweeForm.get('file').clearValidators();
  }

  onFileSelected = (event: any): void => {
    this.uploadedfile = event.target.files[0];
    const acceptedExtensions = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    if (acceptedExtensions.includes(this.uploadedfile.type)) {
      this.resume = this.uploadedfile.name;
      this.isWrongFile = false;
    } else {
      this.uploadedfile = File;
      this.remove();
      this.isWrongFile = true;
    }
  }

  onSubmit = (): void => {
    const interviewee = new Interviewee();
    interviewee.email = this.addorEditIntervieweeForm.value.email.trim();
    interviewee.name = this.addorEditIntervieweeForm.value.name.trim();
    interviewee.phone = this.addorEditIntervieweeForm.value.phone;
    interviewee.resume = this.resume;
    interviewee.currentCompany = this.addorEditIntervieweeForm.value.currentCompany.trim();
    interviewee.currentCTC = this.addorEditIntervieweeForm.value.currentCTC;
    interviewee.expectedCTC = this.addorEditIntervieweeForm.value.expectedCTC;
    interviewee.noticePeriod = this.addorEditIntervieweeForm.value.noticePeriod;
    interviewee.yoe = Number(this.addorEditIntervieweeForm.value.yoe).toFixed(2);
    interviewee.designation = this.addorEditIntervieweeForm.value.designation;
    interviewee.department = this.addorEditIntervieweeForm.value.department;

    if (!this.addorEditIntervieweeForm.valid) {
      this.addorEditIntervieweeForm.markAllAsTouched();
    } else if (!this.resume) {
      return;
    }
    else {
      const formData = new FormData();
      formData.append('interviewee', this.convertJsonToBinary(interviewee));
      formData.append('file', this.uploadedfile);
      if (this.data.id > 0) {
        this.isLoading = true;
        this.intervieweeService.editInterviewee(formData, this.data.id).subscribe(
          (response: any) => {
            if (response.response) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.dialogRef.close(response.response);
            }
            else {
              this.notifyService.showError(response.message, 'Error');
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.notifyService.showError('Something went wrong!', 'Error');
          }
        );
      } else {
        this.isLoading = true;
        this.intervieweeService.addInterviewee(formData).subscribe(
          (response: any) => {
            if (response.response) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.dialogRef.close(response.data);
            }
            else {
              this.notifyService.showError(response.message, 'Error');
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            this.notifyService.showError('Something went wrong!', 'Error');
          }
        );
      }
    }
  }

  setEditIntervieweePopupData = (id: any): void => {
    this.isLoading = true;
    this.intervieweeService.getIntervieweeById(id).subscribe(
      (response: any) => {
        if (response.response) {
          this.interviewee = response.data;
          this.addorEditIntervieweeForm.patchValue(this.interviewee);
          this.addorEditIntervieweeForm.controls.designation.setValue(this.interviewee.designation?.id || '');
          this.addorEditIntervieweeForm.controls.department.setValue(this.interviewee.department?.id || '');
          if (this.interviewee.isResumePresent) {
            this.resume = this.interviewee.resume;
            this.isRemoved = false;
          }else{
            this.addorEditIntervieweeForm.controls.file.setErrors({required: true });
          }
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
          this.notifyService.showError(response.message, 'Error');
        }
      },
      (error) => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!', 'Error');
      }
    );
  }

  closeDialog = (): void => {
    this.dialogRef.close(false);
  }

  convertJsonToBinary(jsonData: any): Blob {
    const jsonString = JSON.stringify(jsonData);
    const binaryData = new Blob([jsonString], { type: 'application/json' });
    return binaryData;
  }
  remove = (): void => {
    this.isRemoved = true;
    this.resume = undefined;
    this.uploadedfile = File;
    this.addorEditIntervieweeForm.patchValue({ file: '' });
    this.addorEditIntervieweeForm.controls.file.setErrors({required: true });
  }
  limitDecimalDigits = (event: any): void => {
    const input = event.target.value;
    const decimalIndex = input.indexOf('.');
    if (decimalIndex !== -1 && input.substring(decimalIndex + 1).length > 2) {
      event.target.value = input.substring(0, decimalIndex + 3);
    }
  }
  preventNumericInput = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    const isLetter = (key >= 'a' && key <= 'z');
    if (!(
      (event.code === 'Space') ||
      (event.code === 'Arrow Left') ||
      (event.code === 'Arrow Right') ||
      (event.code === 'Backspace') ||
      (event.code === 'Tab')) && !isLetter) {
      event.preventDefault();
    }
  }

  preventNonNumericInput = (event: KeyboardEvent): void => {
    const key = event.key;
    const isNum = (key >= '0' && key <= '9');
    if (!(
      (event.code === 'Period') ||
      (event.code === 'ArrowLeft') ||
      (event.code === 'ArrowRight') ||
      (event.code === 'Backspace')) && !isNum) {
      event.preventDefault();
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
        this.departmentList = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }
}

