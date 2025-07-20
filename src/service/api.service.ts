import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {
    console.log('hello from ApiService');
  }

  get<T>(url: string): Observable<T> {
    const fullUrl = this.buildUrl(url);
    console.log(fullUrl );
    return this.http.get<T>(fullUrl ).pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any): Observable<T> {
    const fullUrl = this.buildUrl(url);
    console.log(fullUrl );
    return this.http.post<T>(fullUrl , body).pipe(catchError(this.handleError));
  }

  put<T>(url: string, body: any): Observable<T> {
    const fullUrl = this.buildUrl(url);
    console.log(fullUrl );
    return this.http.put<T>(fullUrl , body).pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    const fullUrl = this.buildUrl(url);
    return this.http.delete<T>(fullUrl ).pipe(catchError(this.handleError));
  }
  private buildUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return environment.apiBaseUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Error: ${error.error.message}`;
    } else {
      errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMsg);
  }
}
