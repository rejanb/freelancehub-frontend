import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface Dispute {
  id: number;
  contract: number;
  initiator: number;
  respondent: number;
  type:  'payment' | 'quality' | 'communication' | 'scope' | 'deadline' | 'other';
  status: 'open' | 'in_mediation' | 'resolved' | 'closed';
  title: string;
  description: string;
  desired_resolution: string;
  resolution_details?: string;
  resolution_amount?: number;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  contract_title?: string;
  initiator_name?: string;
  respondent_name?: string;
}

export interface DisputeMessage {
  id: number;
  dispute: number;
  sender: number;
  message: string;
  attachments?: string[];
  is_admin: boolean;
  created_at: string;
  sender_name?: string;
}

export interface DisputeResolution {
  id: number;
  dispute: number;
  resolution_type: 'refund' | 'partial_payment' | 'full_payment' | 'revision' | 'cancellation' | 'other';
  amount?: number;
  description: string;
  accepted_by_initiator: boolean;
  accepted_by_respondent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DisputeFilters {
  contract?: number;
  type?: string;
  status?: string;
  initiator?: number;
  respondent?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

export interface DisputeStats {
  total_disputes: number;
  open_disputes: number;
  resolved_disputes: number;
  average_resolution_time: number;
  disputes_by_type: {
    type: string;
    count: number;
    percentage: number;
  }[];
  disputes_by_status: {
    status: string;
    count: number;
    percentage: number;
  }[];
  monthly_disputes: {
    month: string;
    opened: number;
    resolved: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private baseUrl = `${ApiConst.API_URL}disputes/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all disputes with optional filtering
   */
  getDisputes(filters?: DisputeFilters): Observable<ApiResponse<Dispute>> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof DisputeFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Dispute>>(this.baseUrl, { params });
  }

  /**
   * Get a specific dispute by ID
   */
  getDispute(id: number): Observable<Dispute> {
    return this.http.get<Dispute>(`${this.baseUrl}${id}/`);
  }

  /**
   * Create a new dispute
   */
  createDispute(disputeData: Partial<Dispute>): Observable<Dispute> {
    const formData = new FormData();

    Object.keys(disputeData).forEach(key => {
      const value = disputeData[key as keyof Dispute];
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file: File | string) => {
            if (file instanceof File) {
              formData.append('attachments', file);
            }
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.post<Dispute>(this.baseUrl, formData);
  }

  /**
   * Update dispute details
   */
  updateDispute(id: number, disputeData: Partial<Dispute>): Observable<Dispute> {
    return this.http.patch<Dispute>(`${this.baseUrl}${id}/`, disputeData);
  }

  /**
   * Get dispute messages
   */
  getDisputeMessages(disputeId: number): Observable<ApiResponse<DisputeMessage>> {
    return this.http.get<ApiResponse<DisputeMessage>>(`${this.baseUrl}${disputeId}/messages/`);
  }

  /**
   * Send dispute message
   */
  sendMessage(disputeId: number, message: string, attachments?: File[]): Observable<DisputeMessage> {
    const formData = new FormData();
    formData.append('message', message);

    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return this.http.post<DisputeMessage>(`${this.baseUrl}${disputeId}/messages/`, formData);
  }

  /**
   * Propose resolution
   */
  proposeResolution(disputeId: number, resolutionData: Partial<DisputeResolution>): Observable<DisputeResolution> {
    return this.http.post<DisputeResolution>(`${this.baseUrl}${disputeId}/resolutions/`, resolutionData);
  }

  /**
   * Accept resolution
   */
  acceptResolution(disputeId: number, resolutionId: number): Observable<DisputeResolution> {
    return this.http.post<DisputeResolution>(
      `${this.baseUrl}${disputeId}/resolutions/${resolutionId}/accept/`,
      {}
    );
  }

  /**
   * Reject resolution
   */
  rejectResolution(disputeId: number, resolutionId: number, reason: string): Observable<DisputeResolution> {
    return this.http.post<DisputeResolution>(
      `${this.baseUrl}${disputeId}/resolutions/${resolutionId}/reject/`,
      { reason }
    );
  }

  /**
   * Request mediation
   */
  requestMediation(disputeId: number): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${disputeId}/mediation/`, {});
  }

  /**
   * Close dispute
   */
  closeDispute(disputeId: number, reason: string): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${disputeId}/close/`, { reason });
  }

  /**
   * Escalate dispute
   */
  escalateDispute(disputeId: number, reason: string): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${disputeId}/escalate/`, { reason });
  }

  /**
   * Get dispute statistics
   */
  getDisputeStats(filters?: DisputeFilters): Observable<DisputeStats> {
    let params = new HttpParams();

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof DisputeFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<DisputeStats>(`${this.baseUrl}stats/`, { params });
  }

  /**
   * Download dispute attachments
   */
  downloadAttachment(disputeId: number, attachmentId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${disputeId}/attachments/${attachmentId}/`, {
      responseType: 'blob'
    });
  }

  /**
   * Get dispute resolution history
   */
  getResolutionHistory(disputeId: number): Observable<DisputeResolution[]> {
    return this.http.get<DisputeResolution[]>(`${this.baseUrl}${disputeId}/resolutions/`);
  }

  /**
   * Get dispute summary for contract
   */
  getContractDisputeSummary(contractId: number): Observable<{
    total_disputes: number;
    open_disputes: number;
    resolved_disputes: number;
    latest_dispute?: Dispute;
  }> {
    return this.http.get<{
      total_disputes: number;
      open_disputes: number;
      resolved_disputes: number;
      latest_dispute?: Dispute;
    }>(`${this.baseUrl}contract/${contractId}/`);
  }

}
