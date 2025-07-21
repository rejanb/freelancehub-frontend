
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobService {
  private baseUrl = '/api/jobs/';

  constructor(private api: ApiService) {}

  getJobs(): Observable<any[]> {
    return this.api.get<any[]>(this.baseUrl);
  }

  getJob(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`);
  }

  createJob(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  updateJob(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data);
  }

  deleteJob(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }
}
