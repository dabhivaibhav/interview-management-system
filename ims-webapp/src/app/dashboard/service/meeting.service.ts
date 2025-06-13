import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  constructor(private httpClient: HttpClient) { }

  setIsJoined(id: number): Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/interview/' + id + '/meeting/join/by/interviwer', null);
  }

  checkInterviewerStatus(id: number): Observable<any>{
    return this.httpClient.get(environment.apiUrl + '/interview/check/status/' + id);
  }

  endMeeting(id: number): Observable<any>{
    return this.httpClient.put(environment.apiUrl + '/interview/update-interview-status/' + id , null);
  }
}
