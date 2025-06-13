import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NotificationService } from 'src/app/notification.service';
import { DialogService } from '../../service/dialog.service';
import { InterviewService } from '../../service/interview.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-interviewee-details-dialog',
  templateUrl: './interviewee-details-dialog.component.html',
  styleUrls: ['./interviewee-details-dialog.component.css']
})
export class IntervieweeDetailsDialogComponent implements OnInit {

  isLoading = false;
  dataSource: any = new MatTableDataSource<any>();
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 20];

  sortOrder = 'asc';
  sortField = '';
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  displayedColumns: string[] = ['srno', 'interviewerName', 'roundType', 'scheduledAt', 'status', 'actions'];

  constructor(
    private interviewService: InterviewService,
    private dialog: DialogService, private notifyService: NotificationService,
    public dialogRef: MatDialogRef<IntervieweeDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.interviews?.length > 0) {
      this.dataSource = new MatTableDataSource(data.interviews);
    }
  }

  ngOnInit(): void {
  }
  closeDialog(): void {
    this.dialogRef.close(false);
  }

  sortChange(event: Sort): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
  }

  feedbackInterview(interview: any): void {
    const feedbackInterviewModal = this.dialog.openFeedbackInterviewDialog(interview);
    feedbackInterviewModal.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  checkInterviewIsNotComplted(interviewStatus: string): boolean {
    return interviewStatus !== 'COMPLETED';
  }
}
