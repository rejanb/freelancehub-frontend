import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import {ApiResponse} from '../app/model/models';

export interface ProjectFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  skills?: string[];
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private baseUrl = '/api/projects/projects/';
  private categoryUrl = 'api/projects/categories/';

  constructor(private api: ApiService) {}

  getCategories(): Observable<any[]> {
    return this.api.get<any[]>(`${this.categoryUrl}`);
  }

  /**
   * Get projects based on user role (automatically filtered by backend)
   */
  getProjects(params: ProjectFilters = {}): Observable<ApiResponse<any>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('page_size', params.pageSize.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.status) queryParams.set('status', params.status);
    if (params.category) queryParams.set('category', params.category);
    if (params.budget_min) queryParams.set('budget_min', params.budget_min.toString());
    if (params.budget_max) queryParams.set('budget_max', params.budget_max.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get(`${this.baseUrl}${query}`);
  }

  /**
   * Get projects specific to current user
   * - Clients: Their posted projects
   * - Freelancers: Projects assigned to them
   */
  getMyProjects(): Observable<ApiResponse<any>> {
    return this.api.get(`${this.baseUrl}my_projects/`);
  }

  /**
   * Get available projects for freelancers (open projects without assigned freelancer)
   */
  getAvailableProjects(): Observable<ApiResponse<any>> {
    return this.api.get(`${this.baseUrl}available_projects/`);
  }

  /**
   * Get featured projects (public to all users)
   */
  getFeaturedProjects(): Observable<any[]> {
    return this.api.get(`${this.baseUrl}featured_projects/`);
  }

  /**
   * Get admin overview with statistics (admin only)
   */
  getAdminOverview(): Observable<any> {
    return this.api.get(`${this.baseUrl}admin_overview/`);
  }

  getProject(id: string): Observable<any> {
    return this.api.get<any>(`${this.baseUrl}${id}/`);
  }

  createProject(data: any): Observable<any> {
    return this.api.post<any>(this.baseUrl, data);
  }

  updateProject(id: string, data: any): Observable<any> {
    return this.api.put<any>(`${this.baseUrl}${id}/`, data);
  }

  deleteProject(id: string): Observable<any> {
    return this.api.delete<any>(`${this.baseUrl}${id}/`);
  }

  /**
   * Assign a freelancer to a project (client only)
   */
  assignFreelancer(projectId: string, freelancerId: number): Observable<any> {
    return this.api.post(`${this.baseUrl}${projectId}/assign_freelancer/`, {
      freelancer_id: freelancerId
    });
  }

  /**
   * Mark project as completed (client only)
   */
  markCompleted(projectId: string): Observable<any> {
    return this.api.post(`${this.baseUrl}${projectId}/mark_completed/`, {});
  }

  // Project Proposals
  /**
   * Apply for a project (freelancers only)
   */
  applyForProject(projectId: string, proposalData: any): Observable<any> {
    return this.api.post(`${this.baseUrl}${projectId}/apply/`, proposalData);
  }

  /**
   * Get all proposals for a specific project (client and admin only)
   */
  getProjectProposals(projectId: string): Observable<any> {
    return this.api.get(`${this.baseUrl}${projectId}/proposals/`);
  }

  /**
   * Get freelancer's project applications
   */
  getMyApplications(params: { page?: number; pageSize?: number } = {}): Observable<any> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('page_size', params.pageSize.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get(`${this.baseUrl}my_applications/${query}`);
  }

  // Proposal Management
  /**
   * Get all proposals (filtered by user role)
   */
  getAllProposals(params: { page?: number; pageSize?: number } = {}): Observable<any> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.set('page', params.page.toString());
    if (params.pageSize) queryParams.set('page_size', params.pageSize.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.api.get(`/api/projects/proposals/${query}`);
  }

  /**
   * Accept a proposal (client and admin only)
   */
  acceptProposal(proposalId: number): Observable<any> {
    return this.api.post(`/api/projects/proposals/${proposalId}/accept/`, {});
  }

  /**
   * Reject a proposal (client and admin only)
   */
  rejectProposal(proposalId: number): Observable<any> {
    return this.api.post(`/api/projects/proposals/${proposalId}/reject/`, {});
  }

  /**
   * Withdraw a proposal (freelancer only)
   */
  withdrawProposal(proposalId: number): Observable<any> {
    return this.api.post(`/api/projects/proposals/${proposalId}/withdraw/`, {});
  }

  /**
   * Search projects by various criteria
   */
  searchProjects(query: string, filters?: ProjectFilters): Observable<ApiResponse<any>> {
    const params: ProjectFilters = { ...filters, search: query };
    return this.getProjects(params);
  }

  // Saved Projects
  /**
   * Save/bookmark a project
   */
  saveProject(projectId: string): Observable<any> {
    return this.api.post(`${this.baseUrl}${projectId}/save_project/`, {});
  }

  /**
   * Unsave/unbookmark a project
   */
  unsaveProject(projectId: string): Observable<any> {
    return this.api.delete(`${this.baseUrl}${projectId}/unsave_project/`);
  }

  /**
   * Get user's saved projects
   */
  getSavedProjects(): Observable<any> {
    return this.api.get(`${this.baseUrl}saved_projects/`);
  }

  /**
   * Check if a project is saved by current user
   */
  isProjectSaved(projectId: string): Observable<any> {
    return this.api.get(`${this.baseUrl}${projectId}/is_saved/`);
  }

  /**
   * Upload an attachment to a project
   */
  uploadAttachment(projectId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post(`${this.baseUrl}${projectId}/upload_attachment/`, formData);
  }

  /**
   * Get attachments for a project
   */
  getAttachments(projectId: string): Observable<any> {
    return this.api.get(`${this.baseUrl}${projectId}/attachments/`);
  }

  /**
   * Delete an attachment
   */
  deleteAttachment(projectId: string, attachmentId: number): Observable<any> {
    return this.api.delete(`${this.baseUrl}${projectId}/attachments/${attachmentId}/`);
  }

  /**
   * Get contract files for a project
   */
  getContractFiles(projectId: string): Observable<any> {
    return this.api.get(`${this.baseUrl}${projectId}/contract_files/`);
  }

  /**
   * Upload a contract file to a project
   */
  uploadContractFile(projectId: string, formData: FormData): Observable<any> {
    return this.api.post(`${this.baseUrl}${projectId}/upload_contract_file/`, formData);
  }

  /**
   * Delete a contract file
   */
  deleteContractFile(projectId: string, fileId: number): Observable<any> {
    return this.api.delete(`${this.baseUrl}${projectId}/contract_files/${fileId}/`);
  }
}
