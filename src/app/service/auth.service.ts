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

  // logout(refresh: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}users/logout/`, {refresh});
  // }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('access', token);
  }


  getRefreshToken(): string | null {
    return localStorage.getItem('refresh');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh', token);
  }

  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post<any>(`${this.baseUrl}/refresh`, { refresh });
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
  }
  register(user: RegisterFormData): Observable<any> {
    return this.http.post(`${this.baseUrl}users/register/`, user);
  }

  // refreshToken(): Observable<any> {
  //   const token = localStorage.getItem(ApiConst.tokenKey) as any;
  //   console.log('Token:', token?.refresh);
  //   const refresh = token.refresh;
  //   return this.http.post<any>(`${this.baseUrl}/refresh`, { refresh });
  // }

  sendPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/reset_password/`, { email });
  }

  confirmPasswordReset(uid: string, token: string, new_password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}users/reset_password_confirm/`, {
      uid, token, new_password
    });
}
}
