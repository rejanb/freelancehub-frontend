import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse, Job } from '../app/model/models';

export interface JobFilters {
  search?: string;
  is_open?: boolean;
  budget_min?: number;
  budget_max?: number;
  deadline_from?: string;
  deadline_to?: string;
  created_after?: string;
  created_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private baseUrl = `${ApiConst.API_URL}jobs/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all jobs with optional filtering
   */
  getJobs(filters?: JobFilters): Observable<ApiResponse<Job>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof JobFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Job>>(this.baseUrl, { params });
  }

  /**
   * Get a specific job by ID
   */
  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}${id}/`);
  }

  /**
   * Create a new job (client only)
   */
  createJob(jobData: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(this.baseUrl, jobData);
  }

  /**
   * Update an existing job (client only)
   */
  updateJob(id: number, jobData: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}${id}/`, jobData);
  }

  /**
   * Partially update a job (client only)
   */
  patchJob(id: number, jobData: Partial<Job>): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}${id}/`, jobData);
  }

  /**
   * Delete a job (client only)
   */
  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  /**
   * Get jobs posted by current user (client)
   */
  getMyJobs(): Observable<ApiResponse<Job>> {
    return this.http.get<ApiResponse<Job>>(`${this.baseUrl}my_jobs/`);
  }

  /**
   * Get available jobs for freelancers (jobs they haven't applied to)
   */
  getAvailableJobs(): Observable<ApiResponse<Job>> {
    return this.http.get<ApiResponse<Job>>(`${this.baseUrl}available_jobs/`);
  }

  /**
   * Get admin overview with statistics
   */
  getAdminOverview(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}admin_overview/`);
  }

  /**
   * Close a job (mark as no longer accepting proposals)
   */
  closeJob(id: number): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}${id}/close/`, {});
  }

  /**
   * Reopen a job
   */
  reopenJob(id: number): Observable<Job> {
    return this.http.patch<Job>(`${this.baseUrl}${id}/reopen/`, {});
  }

  /**
   * Search jobs by title and description
   */
  searchJobs(query: string, page?: number): Observable<ApiResponse<Job>> {
    let params = new HttpParams().set('search', query);
    if (page) {
      params = params.set('page', page.toString());
    }
    return this.http.get<ApiResponse<Job>>(this.baseUrl, { params });
  }
} 