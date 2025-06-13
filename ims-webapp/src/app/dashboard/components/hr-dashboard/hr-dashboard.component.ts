import { Component, OnInit } from '@angular/core';
import { InterviewerService } from '../../service/interviewer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {

  constructor(private interviewerService: InterviewerService, private router: Router) {
  }

  ngOnInit(): void {
  }

}
