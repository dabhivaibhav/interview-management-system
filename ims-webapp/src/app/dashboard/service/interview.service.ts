import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  constructor(private http: HttpClient) { }

  getAllInterviews(body: any): Observable<any> {
      return this.http.post(`${environment.apiUrl}/interview/`, body);
  }
  scheduleInterview(body: any, isUpdate: boolean, id: any): Observable<any> {
    if (isUpdate) {
      return this.http.put(`${environment.apiUrl}/interview/${id}`, body);
    }else{
      return this.http.post(`${environment.apiUrl}/interview/schedule`, body);
    }
  }

  deleteInterview(id: number): Observable<any>{
    return this.http.delete(`${environment.apiUrl}/interview/by/${id}`);
  }

  cancelInterview(request: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/interview/cancel', request);
  }

  requestReschedule(request: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/interview/request-reschedule', request);
  }

  approveOrRejectRequest(body: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/interview/request-reschedule/approve-or-reject`, body);
  }
}
