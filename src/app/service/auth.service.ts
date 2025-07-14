import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiConst} from '../const/api-const';
import {RegisterFormData} from '../model/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = ApiConst.API_URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/login/`, { email, password });
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/logout/`, {refresh});
  }

  register(user: RegisterFormData): Observable<any> {
    return this.http.post(`${this.baseUrl}users/register/`, user);
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
