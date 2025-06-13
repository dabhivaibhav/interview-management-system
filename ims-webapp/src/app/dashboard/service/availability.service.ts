import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Availability } from '../model/availability.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {


  constructor(private http: HttpClient) { }

  addAvailability(avail: Availability): Observable<any>{
    return this.http.post(`${environment.apiUrl}/interviewer-availability/add`, avail);
  }

  getAvailability(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/interviewer-availability/by-email`);
  }

  updateAvailability(avail: Availability): Observable<any>{
    return this.http.post(`${environment.apiUrl}/interviewer-availability/update`, avail);
  }

  getAvailabilityList(avail: Availability): Observable<any>{
    return this.http.post(`${environment.apiUrl}/interviewer-availability/check`, avail);
  }

  deleteAvailability(id: number): Observable<any>{
    return this.http.delete(`${environment.apiUrl}/interviewer-availability/` + id);
  }

  getInterviewerAvailability(email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/interviewer-availability/by-email/${email}`);
  }
}
