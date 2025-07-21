import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private baseUrl = '/api/users/';

    constructor(private api: ApiService) { }

    getUsers(): Observable<any[]> {
        return this.api.get<any[]>(this.baseUrl);
    }

    getUser(id: string): Observable<any> {
        return this.api.get<any>(`${this.baseUrl}${id}/`);
    }

    createUser(data: any): Observable<any> {
        return this.api.post<any>(this.baseUrl, data);
    }

    updateUser(id: string, data: any): Observable<any> {
        return this.api.put<any>(`${this.baseUrl}${id}/`, data);
    }

    deleteUser(id: string): Observable<any> {
        return this.api.delete<any>(`${this.baseUrl}${id}/`);
    }
} 