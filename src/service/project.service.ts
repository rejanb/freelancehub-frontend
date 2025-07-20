import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import {ApiResponse} from '../app/model/models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = '/api/projects/projects/';
    private categoryUrl = '/api/projects/categories/';
  // Adjust API endpoint as needed

  constructor(private api: ApiService) {}

  getCategories(): Observable<any[]> {
    return this.api.get<any[]>(`${this.categoryUrl}`);
  }

  getProjects(params: { page: number, pageSize: number, search?: string }) : Observable<ApiResponse<any>>{
  const query = `?page=${params.page}&page_size=${params.pageSize}${params.search ? `&search=${params.search}` : ''}`;
  return this.api.get(`/api/projects/projects/${query}`);
}

  getProject(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}/${id}`);
  }

  createProject(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  updateProject(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteProject(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }
}
