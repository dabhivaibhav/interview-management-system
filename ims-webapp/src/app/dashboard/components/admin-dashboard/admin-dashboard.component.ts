import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor() { }

  uploadedfile: File | any;
  resume: string | undefined;
  isWrongFile = false;
  isRemoved = true;

  addInterviewerForm: any = new FormGroup({
    file: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
  }

  onFileSelected = (event: any): void => {

    this.uploadedfile = event.target.files[0];
    console.log(this.uploadedfile);

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

  remove = (): void => {
    this.isRemoved = true;
    this.resume = undefined;
    this.uploadedfile = File;
    this.addInterviewerForm.patchValue({ file: '' });
    this.addInterviewerForm.controls.file.setErrors({required: true });
  }

  onSubmit(): void{
    console.log(this.addInterviewerForm.controls.file.value);
  }
}
