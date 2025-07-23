import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  // Admin Dashboard APIs
  getJobsAdminOverview(): Observable<any> {
    return this.api.get('/api/jobs/admin_overview/');
  }

  getProjectsAdminOverview(): Observable<any> {
    return this.api.get('/api/projects/projects/admin_overview/');
  }

  // User-specific Dashboard APIs
  getMyJobs(): Observable<any> {
    return this.api.get('/api/jobs/my_jobs/');
  }

  getMyProjects(): Observable<any> {
    return this.api.get('/api/projects/projects/my_projects/');
  }

  getAvailableJobs(): Observable<any> {
    return this.api.get('/api/jobs/available_jobs/');
  }

  getAvailableProjects(): Observable<any> {
    return this.api.get('/api/projects/projects/available_projects/');
  }

  // Applications and Proposals
  getMyJobApplications(): Observable<any> {
    return this.api.get('/api/jobs/my_applications/');
  }

  getMyProjectApplications(): Observable<any> {
    return this.api.get('/api/projects/projects/my_applications/');
  }

  // Featured content
  getFeaturedJobs(): Observable<any> {
    return this.api.get('/api/jobs/featured_jobs/');
  }

  getFeaturedProjects(): Observable<any> {
    return this.api.get('/api/projects/projects/featured_projects/');
  }

  // Statistics
  getDashboardStats(): Observable<any> {
    return this.api.get('/api/dashboard/stats/');
  }

  // Recent activity
  getRecentActivity(): Observable<any> {
    return this.api.get('/api/dashboard/activity/');
  }
}
