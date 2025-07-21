import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = '/api/payments/';

  constructor(private api: ApiService) {}

  getAll(): Observable<any[]> {
    return this.api.get<any[]>(this.baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`);
  }

  getByUser(userId: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseUrl}?userId=${userId}`);
  }

  createPayment(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  updatePayment(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data);
  }

  deletePayment(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }
}
