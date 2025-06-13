import { Component, OnInit, ViewChild } from '@angular/core';
import { InterviewerService } from '../../service/interviewer.service';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewerSearch } from 'src/app/dashboard/model/InterviewerSearch';
import { Interviewer } from '../../model/Interviewer.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogService } from '../../service/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AddUpdateInterviewerComponent } from '../../dialogs/add-update-interviewer/add-update-interviewer.component';
import { NotificationService } from 'src/app/notification.service';
import { NameWhiteSpace } from 'src/app/name-white-space';
import { CommonService } from '../../service/common/common.service';

@Component({
  selector: 'app-interviewer',
  templateUrl: './interviewer-list.component.html',
  styleUrls: ['./interviewer-list.component.css']
})
export class InterviewerListComponent implements OnInit {

  constructor(private interviewerService: InterviewerService,
              private dialogService: DialogService,
              private notifyService: NotificationService,
              private commonService: CommonService
  ) {
  }

  displayedColumns: string[] = ['srNo', 'firstName', 'email', 'department', 'designation', 'role', 'yoe', 'actions'];

  isLoading = true;
  dataSource: any;
  interviewer: InterviewerSearch[] = [];
  totalData: number = this.interviewer.length;
  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  sortOrder = 'asc';
  sortField = '';
  pageSizeOptions: number[] = [10, 25, 50, 100];
  designationList: any = [];
  departmentList: any = [];
  userRoleList: any = [];

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  interviewerRequest = {
    search: '',
    designation: '',
    department: '',
    sortField: '',
    sortOrder: 'asc',
    experience: '',
    role: '',
    pageIndex: 0,
    pageSize: 10
  };

  searchInterviewerForm: any = new FormGroup({
    search: new FormControl(''),
    designation: new FormControl(''),
    department: new FormControl(''),
    sortField: new FormControl(''),
    sortOrder: new FormControl(''),
    pageIndex: new FormControl(''),
    pageSize: new FormControl(''),
    userRole: new FormControl(''),
    yoe: new FormControl('')
  });

  ngOnInit(): void {
    this.getInterviewers(true);
    this.getDesignationList();
    this.getDepartmentList();
    this.getUserRoleList();
  }

  getInterviewers(isFilter: boolean): void {
    if (isFilter){
      this.pageIndex = 0;
    }
    if (this.searchInterviewerForm.value.search && this.searchInterviewerForm.value.search.trim().length !== 0) {
      this.interviewerRequest.search = this.searchInterviewerForm.value.search.trim();
    } else {
      if (this.searchInterviewerForm.value.search?.length === 0) {
        this.interviewerRequest.search = '';
      } else {
        this.interviewerRequest.search = this.searchInterviewerForm.value.search;
      }
    }

    this.interviewerRequest.designation = this.searchInterviewerForm.value.designation || null;
    this.interviewerRequest.department = this.searchInterviewerForm.value.department || null;
    this.interviewerRequest.sortOrder = this.sortOrder;
    this.interviewerRequest.sortField = this.sortField;
    this.interviewerRequest.pageSize = this.pageSize;
    this.interviewerRequest.pageIndex = this.pageIndex;
    this.interviewerRequest.experience = this.searchInterviewerForm.value.yoe || null;
    this.interviewerRequest.role = this.searchInterviewerForm.value.userRole || null;

    this.isLoading = true;
    this.interviewerService.getInterviewers(this.interviewerRequest).subscribe((response: any) => {
      this.isLoading = true;
      this.interviewer = response.data.employeeList;
      this.dataSource = new MatTableDataSource<InterviewerSearch>(this.interviewer);
      this.totalRows = response.data.count;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!!!', 'Error');
    });
  }

  onSortData(event: any): void {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getInterviewers(true);
  }

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getInterviewers(false);
  }

  onClearAll(): void {
    this.searchInterviewerForm.patchValue(
      {
        search: null,
        designation: null,
        department: null,
        userRole: null,
        yoe: null
      }
    );
    this.getInterviewers(true);
  }

  deleteInterviewer(id: number): void {
    this.dialogService.openDeleteDialog('interviewer').afterClosed().subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = true;
          this.interviewerService.deleteInterviewer(id).subscribe((response: any) => {
            if (response.response === true) {
              this.notifyService.showSuccess(response.message, 'Success');
              this.ngOnInit();
            }
            else {
              this.notifyService.showError(response.message, 'Failed');
            }
          }, (error: any) => {
            this.notifyService.showError('Something went wrong..!! try later', 'Failed');
            console.log(error);
          });
          this.isLoading = false;
        }
      }
    );
  }

  addEditInterviewer(id: number): void {
    this.dialogService.openAddUpdateInterviewerDialog(id).afterClosed().subscribe(
      (response: any) => {
        if (response) {
          this.ngOnInit();
        }
      }
    );
  }

  preventNumericInput(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    const isLetter = (key >= 'a' && key <= 'z');
    if (!(
      (event.code === 'Space') ||
      (event.code === 'Backspace') ||
      (event.code === 'Tab')) && !isLetter) {
      event.preventDefault();
    }
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

  getUserRoleList(): void {
    this.commonService.getRoleList().subscribe((response: any) => {
      if (response.response) {
        this.userRoleList = response.data;
      } else {
        this.notifyService.showError(response.message, 'Error');
      }
    }, (error) => {
      this.notifyService.showError('Something went wrong!! try later', 'Error');
    });
  }

  clearDesignationSelection(): void {
    this.searchInterviewerForm.value.designation = null;
  }
  clearDepartmentSelection(): void {
    this.searchInterviewerForm.value.department = null;
  }

  clearInterviewerRoleSelection(): void {
    this.searchInterviewerForm.value.userRole = null;
  }

}
