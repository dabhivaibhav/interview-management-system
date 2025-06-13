import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { InterviewService } from '../../service/interview.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/notification.service';
import { DialogService } from '../../service/dialog.service';
import { MatDateRangePicker, MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { CommonService } from '../../service/common/common.service';
import * as moment from 'moment';
import { InterviewerService } from '../../service/interviewer/interviewer.service';
@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css']
})
export class InterviewComponent implements OnInit {

  @Input() interviewType!: string;

  form: FormGroup = new FormGroup({
    roundType: new FormControl(''),
    department: new FormControl(''),
    status: new FormControl(''),
    filterDate: new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    }),
    search: new FormControl('')
  });

  roundTypes: any[] = [
    { id: null, priority: 0, roundType: 'No filter' }
  ];
  departmentList: any[] = [
    { id: null, priority: 0, department: 'No filter' }
  ];
  statues: any = [
    { id: undefined, status: 'No filter' }
  ];
  displayedColumns: string[] = ['srno', 'intervieweeName', 'interviewerName',
   'status', 'department', 'roundType', 'scheduledAt', 'actions'];
  body: any = {
    roundType: undefined,
    department: undefined,
    status: undefined,
    startDate: undefined,
    endDate: undefined,
    search: undefined,
    sortField: undefined,
    sortOrder: undefined,
    pageSize: undefined,
    pageIndex: undefined,
    interviewerEmail: undefined
  };

  interviews: any;
  dataSource: any = new MatTableDataSource<any>();

  isLoading = true;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 50, 100];

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
  constructor(
    private commonService: CommonService,
    private interviewService: InterviewService,
    private dialog: DialogService,
    private interviewerService: InterviewerService,
    private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    this.getAllRoundType();
    this.getAllDepartment();
    this.getAllStatus();
    this.role = localStorage.getItem('role');
    if (this.role === 'DEVELOPER' || this.interviewType === 'myInterview') {
      this.displayedColumns = ['srno', 'intervieweeName', 'status', 'department', 'roundType', 'scheduledAt', 'actions'];
    }
    this.getInterviews(true);
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getAllStatus(): void {
    this.commonService.getStatusList().subscribe((response: any) => {
      if (response.response) {
        response.data.forEach((element: any) => {
          this.statues.push(element);
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
  getAllDepartment(): void {
    this.commonService.getDepartmentList().subscribe((response: any) => {
      if (response.response) {
        response.data.forEach((element: any) => {
          this.departmentList.push(element);
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
  openDatePicker(filterDatePicker: any): void {
    if (filterDatePicker) {
      filterDatePicker.open();
    }
  }

  cancelForm(): void {
    this.form.patchValue(
      {
        roundType: null,
        department: null,
        status: null,
        filterDate: {
          start: null,
          end: null
        },
        search: null
      }
    );
    this.ngOnInit();
  }
  getInterviews(isFilter: boolean): void {
    if (isFilter) {
      this.currentPage = 0;
    }
    this.body.status = this.form.value.status || null;
    this.body.roundType = this.form.value.roundType || null;
    this.body.department = this.form.value.department || null;
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
  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInterviews(false);
  }
  sortChange(event: Sort): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getInterviews(true);
  }

  addEditInterview(id: number): void {
    let data = this.interviews?.filter((opt: any) => `${opt.id}`.includes(String(id)));
    for (const i of this.interviews.length) {
      if (this.interviews[i].id === id){
        data = this.interviews[i];
      }
    }
    const interviewAddUpdateModal = this.dialog.openAddUpdateInterviewDialog(id > 0 ? data : null);
    interviewAddUpdateModal.afterClosed().subscribe((result) => {
      if (result) {
        this.getInterviews(true);
      }
    });

  }

  cancelInterview(id: number): void {
    const cancelInterviewModal = this.dialog.openCancelInterviewDialog(id);
    cancelInterviewModal.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  deleteInterview(id: number): void {
    this.dialog.openDeleteDialog('interview').afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.interviewService.deleteInterview(id).subscribe((response: any) => {
            if (response.response === true) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.ngOnInit();
            }
            else {
              this.notifyService.showError(response.message, 'Failed');
            }
          }, (error: any) => {
            this.notifyService.showError('Something went wrong!! try later', 'Failed');
            console.log(error);
          });
        }
      }
    );
  }
  checkCancelledInterview(interviewStatus: string): boolean {
    return interviewStatus === 'CANCELLED' || interviewStatus === 'COMPLETED';
  }

  checkRescheduleInterview(interviewStatus: string): boolean {
    return interviewStatus === 'CANCELLED' || interviewStatus === 'COMPLETED';
  }

  feedbackInterview(interview: any): void {
    const feedbackInterviewModal = this.dialog.openFeedbackInterviewDialog(interview);
    feedbackInterviewModal.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  requestReschedule(interview: any): void {
    const requestReschedulingModal = this.dialog.openRequestReschedulingDialog(interview);
    requestReschedulingModal.afterClosed().subscribe((result) => {
      if (result) {
        this.getInterviews(false);
      }
    });
  }

  joinMeeting(interview: any): void {
    const obj = {meetingLink: interview.meetingLink, interviewId: interview.id};
    const roomRes = 'interviewer-meeting/' + btoa(JSON.stringify(obj));
    const absoluteURL = new URL(roomRes, window.location.href);
    // if want to open in another tab
    window.open(absoluteURL.href, '_blank', 'noopener, noreferrer');
    // if want to open in same tab
    // window.location.href = absoluteURL.href;
  }

  checkInterviewIsNotComplted(interviewStatus: string): boolean {
    return interviewStatus !== 'COMPLETED';
  }

  checkInterviewIsScheduled(interviewStatus: string): boolean {
    return interviewStatus !== 'SCHEDULED';
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

  isScheduledBeforeNow(scheduledAt: Date): boolean {
    const currentDateTime = moment();
    const scheduledDateTime = moment(scheduledAt);
    const threeHoursFromScheduledTime = scheduledDateTime.clone().add(3, 'hours');
    return scheduledDateTime.isBefore(currentDateTime) && currentDateTime.isBefore(threeHoursFromScheduledTime);
  }
}
