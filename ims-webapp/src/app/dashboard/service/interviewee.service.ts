import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntervieweeService {

  constructor(private httpClient: HttpClient) { }

  getAllInterviewees(intervieweeRequest: any): Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/interviewee/search', intervieweeRequest);
  }
  deleteInterviewee(id: number): Observable<any> {
   return this.httpClient.delete(`${environment.apiUrl}/interviewee/${id}`);
  }

  getAllInterviewee(): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/interviewee/all');
  }

  addInterviewee(multipartFile: any): Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/interviewee', multipartFile);
  }

  getIntervieweeById(id: any): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/interviewee/' + id);
  }

  editInterviewee(editIntervieweeRequest: any, id: any): Observable<any>{
    return this.httpClient.put(environment.apiUrl + '/interviewee/' + id, editIntervieweeRequest);
  }
}
