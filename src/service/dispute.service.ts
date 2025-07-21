import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DisputeService {
  private baseUrl = '/api/disputes/';

  constructor(private api: ApiService) {}

  // GET all disputes
  getAll(): Observable<any[]> {
    return this.api.get<any[]>(this.baseUrl);
  }

  // GET a single dispute by ID
  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`);
  }

  // POST a new dispute
  createDispute(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  
  updateDispute(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data);
  }

  
  deleteDispute(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }
}
