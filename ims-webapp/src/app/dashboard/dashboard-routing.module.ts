import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntervieweeListComponent } from './components/interviewee-list/interviewee-list.component';
import { InterviewerListComponent } from './components/interviewer-list/interviewer-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { InterviewComponent } from './components/interview/interview.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AvailabilityListComponent } from './components/availability-list/availability-list.component';
import { InterviewerAvailabilityComponent } from './components/interviewer-availability/interviewer-availability.component';
import { JitsiComponent } from './components/jitsi/jitsi.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { environment } from 'src/environments/environment';
import { HrInterviewListComponent } from './components/hr-interview-list/hr-interview-list.component';
import { MyFeedbackComponent } from './components/my-feedback/my-feedback.component';
import { RescheduleRequestInterviewsComponent } from './components/reschedule-request-interviews/reschedule-request-interviews.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      { path: `${environment.dashboardUrl}`, pathMatch: 'full', component: DashboardComponent},
      { path: `${environment.intervieweeUrl}`, component: IntervieweeListComponent, pathMatch: 'full' },
      { path: `${environment.interviewerUrl}`, component: InterviewerListComponent, pathMatch: 'full' },
      { path: `${environment.profileUrl}`, component: ProfileComponent, pathMatch: 'full' },
      { path: `${environment.interviewUrl}`, component: InterviewComponent, pathMatch: 'full'},
      { path: `${environment.availabilityUrl}`, component: AvailabilityListComponent, pathMatch: 'full' },
      { path: `${environment.myAvailabilityUrl}`, component: InterviewerAvailabilityComponent, pathMatch: 'full' },
      { path: `${environment.myFeedback}`, component: MyFeedbackComponent, pathMatch: 'full' },
      { path: `${environment.interviewerMeetingUrl}/:hashCode`, component: JitsiComponent},
      { path: `${environment.hrInterviewsUrl}`, component: HrInterviewListComponent},
      { path: `${environment.requestedRescheduling}`, component: RescheduleRequestInterviewsComponent},
      { path: '**', redirectTo: `${environment.dashboardUrl}` },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

