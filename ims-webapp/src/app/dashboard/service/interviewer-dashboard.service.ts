import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewerDashboardService {

  constructor(private httpClient: HttpClient) { }

  getInterviewOfYearByMonth(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/developer-dashboard/interviews/last-year');
  }

  getUpcomingInterviews(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/developer-dashboard/interviews/by-timeperiod');
  }

  getInterviewerSpendingHours(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/developer-dashboard/average-duration');
  }

  getInterviewsCurrentMonthStatus(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/developer-dashboard/interviews/by-status');
  }

  getAllInterviewsWhoseFeedbackISPending(): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/developer-dashboard/interview-feedback/pending');
  }

}
