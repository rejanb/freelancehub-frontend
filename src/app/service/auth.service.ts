import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8000/api/auth/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}token/login/`, { username, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}token/logout/`, {});
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}users/`, user);
  }

  sendPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/reset_password/`, { email });
  }

  confirmPasswordReset(uid: string, token: string, new_password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/reset_password_confirm/`, {
      uid, token, new_password
    });
}
}
