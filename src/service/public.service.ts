import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PublicJobFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  skills?: string;
  location?: string;
  ordering?: string;
}

export interface PublicProjectFilters {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  skills?: string;
  location?: string;
  ordering?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private baseUrl = environment.apiBaseUrl || 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Public Job Endpoints
  getPublicJobs(filters: PublicJobFilters = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.baseUrl}/api/jobs/public/`, { params });
  }

  getPublicJob(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/jobs/public/${id}/`);
  }

  // Public Project Endpoints
  getPublicProjects(filters: PublicProjectFilters = {}): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.baseUrl}/api/projects/public/projects/`, { params });
  }

  getPublicProject(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/projects/public/${id}/`);
  }

  // Categories (available to all)
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/projects/categories/`);
  }

  // Search functionality
  searchJobs(query: string, filters: PublicJobFilters = {}): Observable<any> {
    const searchFilters = { ...filters, search: query };
    return this.getPublicJobs(searchFilters);
  }

  searchProjects(query: string, filters: PublicProjectFilters = {}): Observable<any> {
    const searchFilters = { ...filters, search: query };
    return this.getPublicProjects(searchFilters);
  }

  // Get popular/featured content
  getFeaturedJobs(): Observable<any> {
    return this.getPublicJobs({ ordering: '-created_at', page_size: 10 });
  }

  getFeaturedProjects(): Observable<any> {
    return this.getPublicProjects({ ordering: '-created_at', page_size: 10 });
  }

  // Statistics for public dashboard
  getPublicStats(): Observable<any> {
    // This could be implemented as a separate endpoint or derived from the lists
    return this.http.get(`${this.baseUrl}/api/public/stats/`);
  }
}
