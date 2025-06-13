import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  isLoggedIn(): string | null {
    return localStorage.getItem('token');
  }
  getRole(): string {
    const token: string = localStorage.getItem('token') ?? '';
    if (token) {
      const decodeTokenObj = JSON.parse(atob(token.split('.')[1]));
      return decodeTokenObj.groups[0];
    }
    return '';
  }
  setToken(token: any): void {
    localStorage.setItem('token', token);
  }

  setUserEmail(email: any): void {
    localStorage.setItem('email', email);
  }
  setUserName(data: any): void {
    const userName = `${data.firstName} ${data.lastName}`;
    localStorage.setItem('userName', userName);
  }
  doLogin(body: any): Observable<any> {
    localStorage.removeItem('token');
    return this.http.post(`${environment.apiUrl}/user/login`, body);
  }
}
