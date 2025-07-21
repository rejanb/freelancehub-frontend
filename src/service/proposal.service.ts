import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProposalService {
  private baseUrl = '/api/proposals/';

  constructor(private api: ApiService) {}

  getAll(): Observable<any[]> {
    return this.api.get<any[]>(this.baseUrl);
  }

  getProposal(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`);
  }

  createProposal(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  updateProposal(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data);
  }

  deleteProposal(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }
}
