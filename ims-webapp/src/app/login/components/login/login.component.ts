import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  returnUrl !: string;
  isLoading = false;
  emailPattern: RegExp = /^[\d\w]+(\.[\d\w]+)*@[\d\w]+(\.[\d\w]+)*\.[\d\w]{2,}$/;
  passwordPattern: RegExp = new RegExp(`^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\\[\\]{}:;',?/*~$^+=<>]).{8,20}$`);
  hide = true;
  form: any = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
    password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
  });

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    const url = 'returnUrl';
    this.returnUrl = this.route.snapshot.queryParams[environment.returnUrl];
  }

  submitCredential(): void {
    const body: any = {
      email: this.fc?.email?.value,
      password: this.fc?.password?.value
    };
    if (this.form.valid) {
      this.isLoading = true;
      this.loginService.doLogin(body).subscribe((response: any) => {
        if (response.response) {
          this.loginService.setToken(response.data.token);
          this.loginService.setUserName(response.data);
          localStorage.setItem('role', this.loginService.getRole());
          this.loginService.setUserEmail(response.data.email);
          this.notifyService.showSuccess(response.message, 'Success');
          if (this.returnUrl === undefined){
            this.router.navigate([environment.dashboardUrl]);
          }
          else{
            this.router.navigate([this.returnUrl]);
          }
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
          this.notifyService.showError(response.message, 'Failed');
          this.form.reset();
        }
      }, (error) => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      });
    }
  }
  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
