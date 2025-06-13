import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getTopInterviewers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/top-interviewers`);
  }
  getInterviewSummaryByHiringRate(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/success-rate`);
  }
  getHighestInterviewTakerForHr(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/highest-interview-count`);
  }
  getIntervieweeSummaryByCompany(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/interviewee-by-company`);
  }
  getInterviewByType(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/interviews-by-type-last-year`);
  }
  getInterviewSummaryByStatus(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hr-dashboard/interviews-by-status-last-year`);
  }
}
