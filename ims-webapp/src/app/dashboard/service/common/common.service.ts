import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  getRoundList(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/master/get-all-round-types`);
  }

  getStatusList(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/master/get-all-statuses`);
  }
  getRoleList(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/master/get-all-roles`);
  }

  getDesignationList(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/master/get-all-designations`);
  }

  getDepartmentList(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/master/get-all-department`);
  }
}
