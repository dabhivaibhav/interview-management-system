import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewService } from '../../service/interview.service';
import { DialogService } from '../../service/dialog.service';
import { CommonService } from '../../service/common/common.service';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-reschedule-request-interviews',
  templateUrl: './reschedule-request-interviews.component.html',
  styleUrls: ['./reschedule-request-interviews.component.css']
})
export class RescheduleRequestInterviewsComponent implements OnInit {

  constructor(private interviewService: InterviewService,
              private commonService: CommonService,
              private notifyService: NotificationService,
              private dialog: DialogService) { }

  form: FormGroup = new FormGroup({
    roundType: new FormControl(''),
    filterDate: new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    }),
    search: new FormControl('')
  });

  roundTypes: any[] = [
    { id: null, priority: 0, roundType: 'No filter' }
  ];
  displayedColumns: string[] = ['srno', 'intervieweeName', 'interviewerName', 'roundType',
   'scheduledAt', 'rescheduleAt', 'rescheduleReason', 'actions'];
  body: any = {
    roundType: undefined,
    startDate: undefined,
    endDate: undefined,
    search: undefined,
    sortField: undefined,
    sortOrder: undefined,
    pageSize: undefined,
    pageIndex: undefined,
    interviewerEmail: undefined,
    requestForReschedule: undefined
  };

  approveOrReject: any = {
    interviewId: undefined,
    approve: undefined
  };

  interviews: any;
  dataSource: any = new MatTableDataSource<any>();

  isLoading = true;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  @Input() interviewType!: string;
  sortOrder = 'asc';
  sortField = '';
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  role: any = null;
  @ViewChild('datePicker') filterDatePicker: MatDateRangePicker<Date> | undefined;
  interviewers: any;
  data: any;
  interviewerList: any;

  ngOnInit(): void {
    this.getAllRoundType();
    this.getInterviews(true);
  }

  getInterviews(isFilter: boolean): void {
    if (isFilter) {
      this.currentPage = 0;
    }
    this.body.roundType = this.form.value.roundType || null;
    this.body.requestForReschedule = true;
    if (this.form.value.search && this.form.value.search.trim().length !== 0) {
      this.body.search = this.form.value.search.trim();
    } else {
      if (this.form.value.search?.length === 0) {
        this.body.search = null;
      } else {
        this.body.search = this.form.value.search;
      }
    }
    this.body.startDate = this.form.value.filterDate.start || null;
    this.body.endDate = this.form.value.filterDate.end || null;
    this.body.sortOrder = this.sortOrder;
    this.body.sortField = this.sortField;
    this.body.pageSize = this.pageSize;
    this.body.pageIndex = this.currentPage;
    if (this.role === 'DEVELOPER' || this.interviewType === 'myInterview') {
      this.body.interviewerEmail = localStorage.getItem('email');
    }
    // this.cancelForm();
    this.isLoading = true;
    this.interviewService.getAllInterviews(this.body).subscribe((response: any) => {
      if (response.response) {
        this.interviews = response.data.interviewList;
        this.dataSource = new MatTableDataSource(this.interviews);
        this.totalRows = response.data.count;
      } else {
        console.error(response.message);
      }
      this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
        console.log(error);
      });
  }
  approveOrRejectRescheduling(data: number, approve: boolean): void{
    this.approveOrReject.interviewId = data;
    this.approveOrReject.approve = approve;
    this.isLoading = true;
    this.interviewService.approveOrRejectRequest(this.approveOrReject).subscribe((response: any) => {
      if (response.response) {
        this.notifyService.showSuccess(response.message, 'Success');
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
      this.getInterviews(true);
      this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
        this.notifyService.showError('Something went wrong!! try later', 'Error');
      });
  }

  sortChange(event: Sort): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getInterviews(true);
  }
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInterviews(false);
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
    this.ngOnInit();
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
  interviewDetails(element: any): void{
    this.dialog.openInterviewetailsDialog(element);
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
      this.isLoading = false;
    }, (error) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }
}
