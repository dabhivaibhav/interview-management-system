import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewerDashboardService } from 'src/app/dashboard/service/interviewer-dashboard.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-list-of-upcoming-interview',
  templateUrl: './list-of-upcoming-interview.component.html',
  styleUrls: ['./list-of-upcoming-interview.component.css'],
})
export class ListOfUpcomingInterviewComponent implements OnInit {

  constructor(private interviewerDashboardService: InterviewerDashboardService, private notifyService: NotificationService) { }

  displayedColumns: string[] = ['srno', 'intervieweeName', 'status', 'roundType', 'scheduledAt'];
  dataSourceToday: any = new MatTableDataSource<any>();
  dataSourceWeek: any = new MatTableDataSource<any>();
  dataSourceMonth: any = new MatTableDataSource<any>();
  interviews: any;
  isLoading = false;

  ngOnInit(): void {
    this.getInterviewOfYearByMonth();
  }

  getInterviewOfYearByMonth(): void {
    this.isLoading = true;
    this.interviewerDashboardService.getUpcomingInterviews().subscribe((response: any) => {
      if (response.response) {
        if (response.data){
        const data = response.data;
        if (Object.keys(data).length > 0) {
          Object.keys(data).forEach(month => {
            if (month === 'Upcoming interviews Today\'s Interviews') {
              this.interviews = data[month];
              this.dataSourceToday = new MatTableDataSource(this.interviews);
            }
            if (month === 'Upcoming Interviews For this week') {
              this.interviews = data[month];
              this.dataSourceWeek = new MatTableDataSource(this.interviews);
            }
            if (month === 'Upcoming Interviews For this month') {
              this.interviews = data[month];
              this.dataSourceMonth = new MatTableDataSource(this.interviews);
            }
          });
        }
        this.isLoading = false;
      }
      }
      else {
        this.isLoading = false;
        this.notifyService.showError(response.message, 'Failed');
      }
    }, (error: any) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Failed');
      console.log(error);
    });
  }

}
