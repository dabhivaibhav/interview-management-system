import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-interview-list',
  templateUrl: './hr-interview-list.component.html',
  styleUrls: ['./hr-interview-list.component.css']
})
export class HrInterviewListComponent implements OnInit {

  myInterview !: string;

  constructor() { }

  ngOnInit(): void {
  }

}
