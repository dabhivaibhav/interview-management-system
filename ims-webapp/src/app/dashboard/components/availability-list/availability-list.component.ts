import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { AvailabilityService } from '../../service/availability.service';
import { Availability } from '../../model/availability.model';
import { NotificationService } from 'src/app/notification.service';
import { CommonService } from '../../service/common/common.service';
import { DialogService } from '../../service/dialog.service';

export class TableData {
  name !: string;
  email !: string;
  startTime !: string;
  endTime !: string;
}

@Component({
  selector: 'app-availability-list',
  templateUrl: './availability-list.component.html',
  styleUrls: ['./availability-list.component.css']
})
export class AvailabilityListComponent implements OnInit {

  constructor(
    private availabilityService: AvailabilityService,
    private commonService: CommonService,
    private notifyService: NotificationService,
    private dialogService: DialogService) {
    this.availabilityForm.valueChanges.subscribe((value: any) => {
      if (this.availabilityForm.value.startTime !== undefined) {
        if (Number.parseInt(value.startTime, 10) < 9
          || Number.parseInt(value.startTime, 10) > 18
          || (Number.parseInt(value.startTime, 10) === 18
            && Number.parseInt(value.startTime.toString().split(':')[1], 10) > 0)) {
          this.startErrorMsg = 'Enter time between 9 to 18';
        }
        else {
          this.startErrorMsg = '';
        }
      }
      if (this.availabilityForm.value.endTime !== undefined) {
        if (Number.parseInt(value.endTime, 10) < 9
          || Number.parseInt(value.endTime, 10) > 18
          || (Number.parseInt(value.endTime, 10) === 18
            && Number.parseInt(value.endTime.toString().split(':')[1], 10) > 0)) {
          this.endErrorMsg = 'Enter time between 9 to 18';
        }
        else {
          this.endErrorMsg = '';
        }
      }
    });
  }

  displayedColumns: string[] = ['srNo', 'name', 'email', 'designation', 'action'];

  isLoading = true;
  dataSource: any;
  availabililty: Availability[] = [];
  totalData: number = this.availabililty.length;
  totalRows = 0;
  pageSize = 10;
  pageIndex = 0;
  sortOrder = 'asc';
  sortField = '';
  startErrorMsg = '';
  endErrorMsg = '';
  pageSizeOptions: number[] = [10, 25, 50, 100];
  designationList: any = [];
  days = [
    {
      id: 0,
      weekDay: 'No filter'
    },
    {
      id: 1,
      weekDay: 'Monday'
    },
    {
      id: 2,
      weekDay: 'Tuesday'
    },
    {
      id: 3,
      weekDay: 'Wednesday'
    },
    {
      id: 4,
      weekDay: 'Thursday'
    },
    {
      id: 5,
      weekDay: 'Friday'
    }
  ];

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  availabilityForm: any = new FormGroup({
    startTime: new FormControl(undefined),
    endTime: new FormControl(undefined),
    pageIndex: new FormControl(0),
    pageSize: new FormControl(10),
    search: new FormControl(''),
    designation: new FormControl(''),
    weekDay: new FormControl('')
  });

  availabilityRequest: Availability = new Availability();

  ngOnInit(): void {
    this.getAvailabilities(true);
    this.getDesignationList();
  }

  getAvailabilities = (isFilter: boolean): void => {
    if (isFilter) {
      this.pageIndex = 0;
    }
    if (this.startErrorMsg === '' && this.endErrorMsg === '') {
      if (this.availabilityForm.value.search && this.availabilityForm.value.search.trim().length !== 0) {
        this.availabilityRequest.name = this.availabilityForm.value.search.trim();
      } else {
        this.availabilityRequest.name = '';
      }

      this.availabilityRequest.designationId = this.availabilityForm.value.designation || null;
      this.availabilityRequest.startTime = this.availabilityForm.value?.startTime;
      this.availabilityRequest.endTime = this.availabilityForm.value?.endTime;
      this.availabilityRequest.sortOrder = this.sortOrder;
      this.availabilityRequest.sortField = this.sortField;
      this.availabilityRequest.pageSize = this.pageSize;
      this.availabilityRequest.pageIndex = this.pageIndex;
      this.availabilityRequest.day = this.availabilityForm.value?.weekDay || null;
      this.isLoading = true;
      this.availabilityService.getAvailabilityList(this.availabilityRequest).subscribe(
        (response: any) => {
          this.dataSource = new MatTableDataSource<TableData>(response.data.interviewerAvailabilityList);
          this.dataSource.sort = this.sort;
          this.totalRows = response.data.count;
          this.isLoading = false;
        }, () => {
          this.notifyService.showError('Something went wrong!', 'Error');
          this.isLoading = false;
        });
    }
  }

  onSortData = (event: any): void => {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.getAvailabilities(true);
  }

  pageChanged = (event: PageEvent): void => {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAvailabilities(false);
  }

  onClearAll = (): void => {
    this.startErrorMsg = '';
    this.endErrorMsg = '';
    this.availabilityForm.reset();
    this.ngOnInit();
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

  getFooterRowToDisplay(): string[] {
    if (this.dataSource && this.dataSource.data && this.dataSource.data.length === 0) {
      return ['noRecord'];
    } else {
      return ['paginatorCol'];
    }
  }

  clearDesignationSelection(): void {
    this.availabilityForm.value.designation = null;
  }

  getMyAvailability(element: any): void {
    this.isLoading = true;
    this.availabilityService.getInterviewerAvailability(element.interviewer.email).subscribe((response: any) => {
      if (response.response){
        this.isLoading = false;
        this.dialogService.openViewInterviewerAvailabilityDialog(response.data);
      }else{
        this.isLoading = false;
        this.notifyService.showError(response.message, 'Failed');
      }
    },
    (error) => {
      this.isLoading = false;
      this.notifyService.showError('Something went wrong!!', 'Failed');
    });

  }
}
