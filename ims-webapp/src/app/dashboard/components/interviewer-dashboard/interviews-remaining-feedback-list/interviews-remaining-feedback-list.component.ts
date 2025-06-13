import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/dashboard/service/dialog.service';
import { InterviewerDashboardService } from 'src/app/dashboard/service/interviewer-dashboard.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-interviews-remaining-feedback-list',
  templateUrl: './interviews-remaining-feedback-list.component.html',
  styleUrls: ['./interviews-remaining-feedback-list.component.css']
})
export class InterviewsRemainingFeedbackListComponent implements OnInit {

  constructor(
    private interviewerDashboardService: InterviewerDashboardService,
    private notifyService: NotificationService,
    private dialog: DialogService) { }

  displayedColumns: string[] = ['srno', 'intervieweeName', 'status', 'roundType', 'scheduledAt', 'actions'];
  dataSource: any = new MatTableDataSource<any>();

  ngOnInit(): void {
    this.getAllInterviewsWhoseFeedbackISPending();
  }

  getAllInterviewsWhoseFeedbackISPending(): void {
    this.interviewerDashboardService.getAllInterviewsWhoseFeedbackISPending().subscribe((response: any) => {
      if (response.response) {
        if (response.data) {
          this.dataSource = new MatTableDataSource(response.data);
        }
      }
      else {
        this.notifyService.showError(response.message, 'Failed');
      }
    }, (error: any) => {
      this.notifyService.showError('Something went wrong!! try later', 'Failed');
      console.log(error);
    });
  }

  feedbackInterview(interview: any): void {
    const feedbackInterviewModal = this.dialog.openFeedbackInterviewDialog(interview);
    feedbackInterviewModal.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Added interview feedback successfully');
        this.ngOnInit();
      }
    });
  }

}
