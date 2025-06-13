import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Interviewee } from 'src/app/dashboard/model/Interviewee';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../service/dialog.service';
import { IntervieweeService } from '../../service/interviewee.service';
import { NotificationService } from 'src/app/notification.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { CommonService } from '../../service/common/common.service';
import { NoticePeroidDropdownOption } from '../../model/NoticePeriodDropdownOption ';

@Component({
  selector: 'app-interviewee-list',
  templateUrl: './interviewee-list.component.html',
  styleUrls: ['./interviewee-list.component.css']
})
export class IntervieweeListComponent implements OnInit {

  constructor(
    private intervieweeService: IntervieweeService,
    private dialog: DialogService,
    private notifyService: NotificationService,
    private commonService: CommonService) {
  }
  get fc(): { [key: string]: AbstractControl } {
    return this.searchIntervieweeForm.controls;
  }
  displayedColumns: string[] = [
    'srNo', 'name', 'email', 'noticePeriod', 'yoe', 'department', 'designation', 'currentCompany', 'currentCTC', 'expectedCTC', 'resume', 'actions'
  ];
  isLoading = true;
  dataSource: any;
  interviewee: Interviewee[] = [];
  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  sortOrder = 'asc';
  sortField = '';
  pageSizeOptions: number[] = [10, 25, 50, 100];
  designationList: any = [];
  departmentList: any = [];
  mincurrentctcvalue = 0;
  maxcurrentctcvalue = 100;
  minexpectedctcvalue = 0;
  maxexpectedctcvalue = 100;
  noticePeriodOptions: NoticePeroidDropdownOption[] = NoticePeroidDropdownOption.getDefaultOptions();

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  yoePattern: RegExp = /^\d+(\.(0[0-9]|1[0-1]))?$|^\d+(\.[0-1])?$/;
  intervieweeRequest = {
    name: '',
    yoe: '',
    noticePeriod: '',
    designation: '',
    department: '',
    sortField: this.sortField,
    sortOrder: this.sortOrder,
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
    currentCtcStartRange: this.mincurrentctcvalue,
    currentCtcEndRange: this.maxcurrentctcvalue,
    expectedCtcStartRange: this.minexpectedctcvalue,
    expectedCtcEndRange: this.maxcurrentctcvalue
  };



  searchIntervieweeForm: any = new FormGroup({
    name: new FormControl(''),
    yoe: new FormControl('', Validators.pattern(this.yoePattern)),
    noticePeriod: new FormControl(''),
    designation: new FormControl(''),
    department: new FormControl(''),
    minCurrentCTC: new FormControl(this.mincurrentctcvalue),
    maxCurrentCTC: new FormControl(this.maxcurrentctcvalue),
    minExpectedCTC: new FormControl(this.minexpectedctcvalue),
    maxExpectedCTC: new FormControl(this.maxexpectedctcvalue)
  });

  options: Options = {
    floor: 0,
    ceil: 100,
    step: 0.01,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>' + value + '</b>';
        case LabelType.High:
          return '<b>' + value + '</b>';
        default:
          return '' + value;
      }
    }
  };

  ngOnInit(): void {
    this.getInterviewees(true);
    this.getDesignationList();
    this.getDepartmentList();
  }

  getInterviewees(isFilter: boolean): void {
    if (isFilter) {
      this.pageIndex = 0;
    }
    if (this.searchIntervieweeForm.value.yoe) {
      if (this.fc.yoe.errors) {
        return;
      }
    }
    this.intervieweeRequest.name = this.searchIntervieweeForm.value.name?.length !== 0 ? this.searchIntervieweeForm.value.name.trim() : '';
    this.intervieweeRequest.yoe = this.searchIntervieweeForm.value.yoe || '';
    this.intervieweeRequest.noticePeriod = this.searchIntervieweeForm.value.noticePeriod;
    this.intervieweeRequest.sortOrder = this.sortOrder;
    this.intervieweeRequest.sortField = this.sortField;
    this.intervieweeRequest.pageIndex = this.pageIndex;
    this.intervieweeRequest.pageSize = this.pageSize;
    this.intervieweeRequest.designation = this.searchIntervieweeForm.value.designation || '';
    this.intervieweeRequest.department = this.searchIntervieweeForm.value.department || '';
    this.intervieweeRequest.currentCtcStartRange = this.searchIntervieweeForm.value.minCurrentCTC || this.mincurrentctcvalue;
    this.intervieweeRequest.currentCtcEndRange = this.searchIntervieweeForm.value.maxCurrentCTC || this.maxcurrentctcvalue;
    this.intervieweeRequest.expectedCtcStartRange = this.searchIntervieweeForm.value.minExpectedCTC || this.minexpectedctcvalue;
    this.intervieweeRequest.expectedCtcEndRange = this.searchIntervieweeForm.value.maxExpectedCTC || this.maxexpectedctcvalue;
    this.isLoading = true;
    this.intervieweeService.getAllInterviewees(this.intervieweeRequest).subscribe((response: any) => {
      this.interviewee = response.data.intervieweeList;
      this.dataSource = new MatTableDataSource<Interviewee>(this.interviewee);
      this.totalRows = response.data.count;
      this.isLoading = false;
      this.paginator.length = response.data.count;
    },
      error => {
        this.isLoading = false;
        console.log(error);
      }
      );

  }

  onSortData(event: any): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getInterviewees(true);
  }
  onClearAll(): void {
    this.searchIntervieweeForm.patchValue(
      {
        name: '',
        noticePeriod: '',
        yoe: '',
        designation: '',
        department: '',
        minCurrentCTC: 0,
        maxCurrentCTC: 100,
        minExpectedCTC: 0,
        maxExpectedCTC: 100
      }
    );
    this.ngOnInit();
  }
  onPageSizeChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getInterviewees(false);
  }
  viewInterviewee(element: any): void {
    const intervieweeViewModal = this.dialog.openViewIntervieweeDialog(element);
    intervieweeViewModal.afterClosed().subscribe((result) => {
      if (result) {
      }
    });

  }
  addEditInterviewee(id: any, title: string): void {
    const intervieweeModal = this.dialog.openAddUpdateIntervieweeDialog(id, title);
    intervieweeModal.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  deleteInterviewee(id: any): void {
    this.dialog.openDeleteDialog('interviewee').afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.intervieweeService.deleteInterviewee(id).subscribe((response: any) => {
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

  getDesignationList(): void {
    this.commonService.getDesignationList().subscribe((response: any) => {
      if (response.response) {
        this.designationList = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }
  getDepartmentList(): void {
      this.commonService.getDepartmentList().subscribe((response: any) => {
        if (response.response) {
          this.departmentList = response.data;
        } else {
          this.notifyService.showError(response.message, 'Error');
        }
      }, (error) => {
        this.notifyService.showError('Something went wrong!! try later', 'Error');
      });
    }
  getFooterRowToDisplay(): string[] {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length === 0) {
      return ['noRecord'];
    } else {
      return ['paginatorCol'];
    }
  }

  clearNoticePeriodSelection(): void {
    this.searchIntervieweeForm.value.noticePeriod = null;
  }

  clearDesignationSelection(): void {
    this.searchIntervieweeForm.value.designation = null;
  }
  clearDepartmentSelection(): void {
    this.searchIntervieweeForm.value.department = null;
  }
}
