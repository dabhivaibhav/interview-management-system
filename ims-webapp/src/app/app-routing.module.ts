import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guard/login/login.guard';
import { AuthGuard } from './guard/auth/auth.guard';
import { TokenInterceptor } from './dashboard/interceptor/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IntervieweeJitsiComponent } from './interviewee/interviewee-jitsi/interviewee-jitsi.component';
const routes: Routes = [
 {
    path: `${environment.loginUrl}`,
    canActivate: [LoginGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),

 },
 {
    path: `${environment.imsUrl}`,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
 },
 {path: `${environment.intervieweeMeetingUrl}/:hashCode`, component: IntervieweeJitsiComponent, pathMatch: 'full'},
 {
  path: '',
  pathMatch: 'full',
  redirectTo: `${environment.imsUrl}`
},
 {
  path: '**',
  pathMatch: 'full',
  redirectTo: `${environment.imsUrl}`
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ]
})
export class AppRoutingModule { }
