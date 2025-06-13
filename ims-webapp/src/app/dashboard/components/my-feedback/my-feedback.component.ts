import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../service/dialog.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonService } from '../../service/common/common.service';
import { InterviewFeedbackService } from '../../interview-feedback.service';
import { Feedback } from '../../model/Feedback';

@Component({
  selector: 'app-my-feedback',
  templateUrl: './my-feedback.component.html',
  styleUrls: ['./my-feedback.component.css']
})
export class MyFeedbackComponent implements OnInit {

  constructor(private commonService: CommonService,
              private feedbackService: InterviewFeedbackService,
              private notifyService: NotificationService,
              private dialog: DialogService) { }

  displayedColumns: string[] = ['srNo', 'intervieweeName', 'roundType', 'scheduledAt', 'overallScore', 'result', 'actions'];

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  roundTypes: any[] = [
    { id: null, priority: 0, roundType: 'No filter' }
  ];

  form: FormGroup = new FormGroup({
    roundType: new FormControl(''),
    filterDate: new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    }),
    search: new FormControl('')
  });

  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  currentPage = 0;
  sortOrder = 'asc';
  sortField = 'intervieweeName';
  feedback: Feedback[] = [];
  pageSizeOptions: number[] = [2, 10, 25, 50];
  dataSource: any;

  feedbackRequest: any = {
    search: undefined,
    roundType: undefined,
    sortField: undefined,
    sortOrder: undefined,
    startDate: undefined,
    endDate: undefined,
    pageIndex: undefined,
    pageSize: undefined
  };

  ngOnInit(): void {
    this.getAllRoundType();
    this.getFeedbacks(true);
  }

  getFeedbacks(isFilter: boolean): void {
    if (isFilter) {
      this.currentPage = 0;
    }
    this.feedbackRequest.roundType = this.form.value.roundType || null;
    if (this.form.value.search && this.form.value.search.trim().length !== 0) {
      this.feedbackRequest.search = this.form.value.search.trim();
    } else {
      if (this.form.value.search?.length === 0) {
        this.feedbackRequest.search = null;
      } else {
        this.feedbackRequest.search = this.form.value.search;
      }
    }
    this.feedbackRequest.startDate = this.form.value.filterDate.start || null;
    this.feedbackRequest.endDate = this.form.value.filterDate.end || null;
    this.feedbackRequest.interviewerEmail = localStorage.getItem('email');
    this.feedbackRequest.sortOrder = this.sortOrder;
    this.feedbackRequest.sortField = this.sortField;
    this.feedbackRequest.pageSize = this.pageSize;
    this.feedbackRequest.pageIndex = this.currentPage;
    this.feedbackService.getFeedbacks(this.feedbackRequest).subscribe((response: any) => {
      this.feedback = response.data.interviewFeedbackList;
      this.totalRows = response.data.count;
      this.dataSource = new MatTableDataSource<Feedback>(this.feedback);
    }, () => {
      this.notifyService.showError('Something went wrong!!!', 'Error');
    });
  }

  feedbackInterview(interview: any): void {
    const feedbackInterviewModal = this.dialog.openFeedbackInterviewDialog(interview);
    feedbackInterviewModal.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  getAllRoundType(): void {
    this.commonService.getRoundList().subscribe((response: any) => {
      if (response.response) {
        response.data.forEach((element: any) => {
          this.roundTypes.push(element);
        });

      } else {
        this.notifyService.showError(response.message, 'Error');
      }
      // this.isLoading = false;
    }, (error) => {
      // this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

  openDatePicker(filterDatePicker: any): void {
    if (filterDatePicker) {
      filterDatePicker.open();
    }
  }

  getFooterRowToDisplay(): string[] {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length === 0) {
      return ['noRecord'];
    } else {
      return ['paginatorCol'];
    }
  }

  cancelForm(): void {
    this.form.patchValue(
      {
        roundType: null,
        filterDate: {
          start: null,
          end: null
        },
        search: null
      }
    );
    this.getFeedbacks(true);
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getFeedbacks(false);
  }

  onSortData(event: any): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getFeedbacks(true);
  }
}
