import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Interviewer } from '../model/Interviewer.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InterviewerService {
  constructor(private http: HttpClient) { }

  registerInterviewer(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/interviewer/register`, body);
  }

  getInterviewers(interviewerRequest: any): Observable<any>{
    return this.http.post(environment.apiUrl + '/interviewer', interviewerRequest);
  }
  getInterviewer(): Observable<any> {
    return this.http.get(environment.apiUrl + '/interviewer/interviewer-by-token');
  }
  editInterviewerDetails(body: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/interviewer/update-details`, body);
  }

  deleteInterviewer(empId: any): Observable<any>{
    return this.http.delete(environment.apiUrl + '/interviewer/' + empId);
  }

  updateInterviewer(body: any): Observable<any> {
    return this.http.put(environment.apiUrl + '/interviewer/update-interviewer', body);
  }

  getInterviewerById(empId: number): Observable<any>{
    return this.http.get(environment.apiUrl + '/interviewer/' + empId);
  }

  editInterviewerPassword(body: any): Observable<any>{
    return this.http.put(`${environment.apiUrl}/interviewer/change-password`, body);
  }
}
