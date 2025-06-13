import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/service/dashboard/dashboard.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-highest-interview-taker',
  templateUrl: './highest-interview-taker.component.html',
  styleUrls: ['./highest-interview-taker.component.css']
})
export class HighestInterviewTakerComponent implements OnInit {
  isLoading = false;
  data: any = {
    interviewerNameForMonth: '',
    countOfMonthlyInterviews: 0,
    totalMonthlyInterviews: 0,
    interviewerNameForYear: '',
    countOfYearlyInterviews: 0,
    totalOfYearlyInterviews: 0
  };
  constructor(private dashboardService: DashboardService, private notifyService: NotificationService) {
    this.getSuccessRate();
  }

  ngOnInit(): void {
  }

  getSuccessRate(): void {
    this.isLoading = true;
    this.dashboardService.getHighestInterviewTakerForHr().subscribe((response: any) => {
      if (response.response) {
        this.data = response.data;
      }
      else {
        this.notifyService.showError(response.message, 'Failed');
      }
    },
      (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Failed');
        console.log(error);
      }).add(() => {
        this.isLoading = false;
      });
  }

}
