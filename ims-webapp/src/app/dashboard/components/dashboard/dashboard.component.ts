import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/service/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
role = '';
  constructor() {
    this.role = this.getRole();
  }

  ngOnInit(): void {
  }

  getRole(): string {
    const token: string = localStorage.getItem('token') ?? '';
    if (token){
      const decodeTokenObj = JSON.parse(atob(token.split('.')[1]));
      return decodeTokenObj.groups[0];
    }
    return '';
  }
}
