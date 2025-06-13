import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterviewerService {

  constructor(private http: HttpClient) { }

  getAllAvailableInterviewers(body: any): Observable<any>{
    return this.http.post(`${environment.apiUrl}/interviewer-availability/by-timing-and-yoe`, body);
  }
}
