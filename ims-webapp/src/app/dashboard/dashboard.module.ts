import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { InterviewerDashboardComponent } from './components/interviewer-dashboard/interviewer-dashboard.component';
import { IntervieweeListComponent } from './components/interviewee-list/interviewee-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegisterEmployeeDialogComponent } from './components/register-employee-dialog/register-employee-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { InterviewerListComponent } from './components/interviewer-list/interviewer-list.component';
import { InterviewComponent } from './components/interview/interview.component';
import { AddUpdateAvailabilityComponent } from './dialogs/add-update-availability/add-update-availability.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ScheduleAtDateTimePipe } from './pipe/scheduleAt/schedule-at-date-time.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AvailabilityListComponent } from './components/availability-list/availability-list.component';
import { AddUpdateInterviewerComponent } from './dialogs/add-update-interviewer/add-update-interviewer.component';
import { AddUpdateInterviewComponent } from './dialogs/add-update-interview/add-update-interview.component';
import { AddUpdateIntervieweeComponent } from './dialogs/add-update-interviewee/add-update-interviewee/add-update-interviewee.component';
import { InterviewerAvailabilityComponent } from './components/interviewer-availability/interviewer-availability.component';
import { HighestInterviewTakerComponent } from './components/hr-dashboard/highest-interview-taker/highest-interview-taker.component';
import { InterviewByTypeComponent } from './components/hr-dashboard/interview-by-type/interview-by-type.component';
import { InterviewCancelComponent } from './components/interview-cancel/interview-cancel.component';
import { StatusSummaryComponent } from './components/hr-dashboard/status-summary/status-summary.component';
import { HiringRateSummaryComponent } from './components/hr-dashboard/hiring-rate-summary/hiring-rate-summary.component';
import { InterviewerAverageHoursPieChartComponent } from './components/interviewer-dashboard/interviewer-average-hours-pie-chart/interviewer-average-hours-pie-chart.component';
import { InterviewMonthlySummaryBarChartComponent } from './components/interviewer-dashboard/interview-monthly-summary-bar-chart/interview-monthly-summary-bar-chart.component';
import { InterviewFeedbackComponent } from './components/interview-feedback/interview-feedback.component';
import { ListOfUpcomingInterviewComponent } from './components/interviewer-dashboard/list-of-upcoming-interview/list-of-upcoming-interview.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { CompanySummaryComponent } from './components/hr-dashboard/company-summary/company-summary.component';
import { InterviewMonthStatusPieChartComponent } from './components/interviewer-dashboard/interview-month-status-pie-chart/interview-month-status-pie-chart.component';
import { TopInterviewerBarComponent } from './components/hr-dashboard/top-interviewer-bar/top-interviewer-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InterviewsRemainingFeedbackListComponent } from './components/interviewer-dashboard/interviews-remaining-feedback-list/interviews-remaining-feedback-list.component';
import { JitsiComponent } from './components/jitsi/jitsi.component';
import { InterviewerComponent } from './dialogs/interviewer/interviewer.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { IntervieweeDetailsDialogComponent } from './dialogs/interviewee-details-dialog/interviewee-details-dialog.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TimeRangePipe } from './pipe/timeRange/time-range.pipe';
import { InterviewDetailsDialogComponent } from './dialogs/interview-details-dialog/interview-details-dialog.component';
import {MatStepperModule} from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ViewInterviewerAvailabilityDialogComponent } from './dialogs/view-interviewer-availability-dialog/view-interviewer-availability-dialog.component';
import { HrInterviewListComponent } from './components/hr-interview-list/hr-interview-list.component';
import { MyFeedbackComponent } from './components/my-feedback/my-feedback.component';
import { RequestRescheduleComponent } from './dialogs/request-reschedule/request-reschedule.component';
import { RescheduleRequestInterviewsComponent } from './components/reschedule-request-interviews/reschedule-request-interviews.component';

@NgModule({
  declarations: [
    HrDashboardComponent,
    AdminDashboardComponent,
    InterviewerDashboardComponent,
    RegisterEmployeeDialogComponent,
    SidebarComponent,
    InterviewerListComponent,
    IntervieweeListComponent,
    ScheduleAtDateTimePipe,
    InterviewComponent,
    AddUpdateAvailabilityComponent,
    AvailabilityListComponent,
    AddUpdateInterviewerComponent,
    ProfileComponent,
    DeleteDialogComponent,
    AddUpdateInterviewComponent,
    AddUpdateIntervieweeComponent,
    JitsiComponent,
    InterviewerAvailabilityComponent, InterviewMonthStatusPieChartComponent,
    HighestInterviewTakerComponent,
    InterviewCancelComponent, StatusSummaryComponent, CompanySummaryComponent,
    HiringRateSummaryComponent,
    InterviewMonthlySummaryBarChartComponent, ListOfUpcomingInterviewComponent,
    InterviewFeedbackComponent,
    TopInterviewerBarComponent,
    InterviewByTypeComponent,
    InterviewerAverageHoursPieChartComponent,
    DashboardComponent,
    InterviewsRemainingFeedbackListComponent,
    InterviewerComponent,
    LogoutComponent,
    IntervieweeDetailsDialogComponent,
    TimeRangePipe,
    InterviewDetailsDialogComponent,
    ViewInterviewerAvailabilityDialogComponent,
    HrInterviewListComponent,
    MyFeedbackComponent,
    RequestRescheduleComponent,
    RescheduleRequestInterviewsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatSelectModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatCheckboxModule,
    NgxSliderModule,
    MatChipsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatStepperModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
    }
  ]
})
export class DashboardModule { }
