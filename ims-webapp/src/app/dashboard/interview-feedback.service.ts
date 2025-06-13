import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewFeedbackService {

  constructor(private http: HttpClient) { }

  addInterviewFeedback(multipartVideoDTO: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/interview-feedback/add', multipartVideoDTO);
  }

  getInterviewFeedback(interviewId: any): Observable<any>{
    return this.http.get(environment.apiUrl + '/interview-feedback/' + interviewId);
  }

  getFeedbacks(body: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/interview-feedback/get-feedbacks', body);
  }
}
