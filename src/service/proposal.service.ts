import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse, Proposal } from '../app/model/models';

export interface ProposalFilters {
  job?: number;
  freelancer?: number;
  is_accepted?: boolean;
  bid_amount_min?: number;
  bid_amount_max?: number;
  created_after?: string;
  created_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateProposalData {
  job: number;
  cover_letter: string;
  bid_amount: number;
  estimated_duration?: string;
  attachments?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private baseUrl = `${ApiConst.API_URL}proposals/proposals/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all proposals with optional filtering
   */
  getProposals(filters?: ProposalFilters): Observable<ApiResponse<Proposal>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ProposalFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Proposal>>(this.baseUrl, { params });
  }

  /**
   * Get a specific proposal by ID
   */
  getProposal(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${this.baseUrl}${id}/`);
  }

  /**
   * Create a new proposal (freelancer only)
   */
  createProposal(proposalData: CreateProposalData): Observable<Proposal> {
    const formData = new FormData();
    formData.append('job', proposalData.job.toString());
    formData.append('cover_letter', proposalData.cover_letter);
    formData.append('bid_amount', proposalData.bid_amount.toString());
    
    if (proposalData.estimated_duration) {
      formData.append('estimated_duration', proposalData.estimated_duration);
    }

    if (proposalData.attachments) {
      proposalData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    return this.http.post<Proposal>(this.baseUrl, formData);
  }

  /**
   * Update an existing proposal (freelancer only)
   */
  updateProposal(id: number, proposalData: Partial<CreateProposalData>): Observable<Proposal> {
    return this.http.put<Proposal>(`${this.baseUrl}${id}/`, proposalData);
  }

  /**
   * Delete a proposal (freelancer only)
   */
  deleteProposal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  /**
   * Get proposals submitted by current user (freelancer)
   */
  getMyProposals(): Observable<ApiResponse<Proposal>> {
    return this.http.get<ApiResponse<Proposal>>(`${this.baseUrl}my-proposals/`);
  }

  /**
   * Get proposals for a specific job (client view)
   */
  getJobProposals(jobId: number): Observable<ApiResponse<Proposal>> {
    let params = new HttpParams().set('job', jobId.toString());
    return this.http.get<ApiResponse<Proposal>>(this.baseUrl, { params });
  }

  /**
   * Accept a proposal (client only)
   */
  acceptProposal(id: number): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.baseUrl}${id}/accept/`, {});
  }

  /**
   * Reject a proposal (client only)
   */
  rejectProposal(id: number, reason?: string): Observable<Proposal> {
    const data = reason ? { rejection_reason: reason } : {};
    return this.http.patch<Proposal>(`${this.baseUrl}${id}/reject/`, data);
  }

  /**
   * Withdraw a proposal (freelancer only)
   */
  withdrawProposal(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}${id}/withdraw/`, {});
  }

  /**
   * Get proposal statistics for freelancer
   */
  getProposalStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}stats/`);
  }

  /**
   * Mark proposal as shortlisted (client only)
   */
  shortlistProposal(id: number): Observable<Proposal> {
    return this.http.patch<Proposal>(`${this.baseUrl}${id}/shortlist/`, {});
  }
} 