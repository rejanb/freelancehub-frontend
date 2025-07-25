import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConst } from '../app/const/api-const';

export interface Dispute {
  id: number;
  title: string;
  type: 'payment' | 'quality' | 'deadline' | 'scope' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  project?: number;
  contract?: number;
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
  resolution_details?: string;
  resolved_at?: string;
  client_name?: string;
  freelancer_name?: string;
  project_title?: string;
  evidence_count?: number;
  message_count?: number;
  description: string;
  messages?: DisputeMessage[];
  // Additional properties for compatibility
  desired_resolution?: string;
  resolution_amount?: number;
  attachments?: string[];
  initiator_name?: string;
  initiator?: number;
  respondent_name?: string;
  respondent?: number;
  contract_title?: string;
}

export interface DisputeMessage {
  id: number;
  dispute: number;
  sender: number;
  message: string;
  created_at: string;
  sender_name?: string;
  is_system?: boolean;
}

export interface DisputeEvidence {
  id: number;
  dispute: number;
  title: string;
  description: string;
  file?: string;
  file_url?: string;
  uploaded_by: number;
  created_at: string;
}

export interface DisputeCreate {
  title: string;
  description: string;
  type: 'payment' | 'quality' | 'deadline' | 'scope' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id?: number;
  contract_id?: number;
}

export interface DisputeStats {
  total_disputes: number;
  open_disputes: number;
  resolved_disputes: number;
  disputes_by_type: Array<{ type: string; count: number }>;
  monthly_disputes: Array<{ month: string; opened: number; resolved: number }>;
  resolution_rate: number;
  average_resolution_time: number;
}

export interface DisputeResolution {
  id: number;
  dispute: number;
  resolution_type: 'partial_refund' | 'full_refund' | 'deadline_extension' | 'scope_change' | 'mediation' | 'other';
  amount?: number;
  description: string;
  agreed_by_client: boolean;
  agreed_by_freelancer: boolean;
  created_at: string;
  created_by: number;
  // Additional properties for compatibility
  accepted_by_initiator?: boolean;
  accepted_by_respondent?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private baseUrl = `${ApiConst.API_URL}disputes/`;
  private disputesSubject = new BehaviorSubject<Dispute[]>([]);
  public disputes$ = this.disputesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get paginated disputes
  getDisputes(params?: {
    page?: number;
    status?: string;
    type?: string;
    priority?: string;
    search?: string;
  }): Observable<PaginatedResponse<Dispute>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<Dispute>>(this.baseUrl, { params: httpParams }).pipe(
      tap(response => {
        if (params?.page === 1 || !params?.page) {
          this.disputesSubject.next(response.results);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get dispute by ID
  getDispute(id: number): Observable<Dispute> {
    return this.http.get<Dispute>(`${this.baseUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new dispute
  createDispute(dispute: DisputeCreate): Observable<Dispute> {
    return this.http.post<Dispute>(this.baseUrl, dispute).pipe(
      tap(newDispute => {
        const currentDisputes = this.disputesSubject.value;
        this.disputesSubject.next([newDispute, ...currentDisputes]);
      }),
      catchError(this.handleError)
    );
  }

  // Update dispute
  updateDispute(id: number, updates: Partial<Dispute>): Observable<Dispute> {
    return this.http.patch<Dispute>(`${this.baseUrl}${id}/`, updates).pipe(
      tap(updatedDispute => {
        const currentDisputes = this.disputesSubject.value;
        const index = currentDisputes.findIndex(d => d.id === id);
        if (index !== -1) {
          currentDisputes[index] = updatedDispute;
          this.disputesSubject.next([...currentDisputes]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Delete dispute
  deleteDispute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`).pipe(
      tap(() => {
        const currentDisputes = this.disputesSubject.value;
        this.disputesSubject.next(currentDisputes.filter(d => d.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  // Resolve dispute
  resolveDispute(id: number, resolutionDetails: string): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${id}/resolve/`, {
      resolution_details: resolutionDetails
    }).pipe(
      tap(resolvedDispute => {
        const currentDisputes = this.disputesSubject.value;
        const index = currentDisputes.findIndex(d => d.id === id);
        if (index !== -1) {
          currentDisputes[index] = resolvedDispute;
          this.disputesSubject.next([...currentDisputes]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Reject dispute
  rejectDispute(id: number, reason: string): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${id}/reject/`, { reason }).pipe(
      tap(rejectedDispute => {
        const currentDisputes = this.disputesSubject.value;
        const index = currentDisputes.findIndex(d => d.id === id);
        if (index !== -1) {
          currentDisputes[index] = rejectedDispute;
          this.disputesSubject.next([...currentDisputes]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Cancel dispute
  cancelDispute(id: number): Observable<Dispute> {
    return this.http.post<Dispute>(`${this.baseUrl}${id}/cancel/`, {}).pipe(
      tap(cancelledDispute => {
        const currentDisputes = this.disputesSubject.value;
        const index = currentDisputes.findIndex(d => d.id === id);
        if (index !== -1) {
          currentDisputes[index] = cancelledDispute;
          this.disputesSubject.next([...currentDisputes]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Get dispute messages - DISABLED: Messages are included in dispute detail response
  // getDisputeMessages(disputeId: number): Observable<DisputeMessage[]> {
  //   return this.http.get<DisputeMessage[]>(`${this.baseUrl}${disputeId}/messages/`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Add message to dispute
  addDisputeMessage(disputeId: number, message: string): Observable<DisputeMessage> {
    return this.http.post<DisputeMessage>(`${this.baseUrl}${disputeId}/add_message/`, {
      message
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get dispute evidence
  getDisputeEvidence(disputeId: number): Observable<DisputeEvidence[]> {
    return this.http.get<DisputeEvidence[]>(`${this.baseUrl}${disputeId}/evidence/`).pipe(
      catchError(this.handleError)
    );
  }

  // Add evidence to dispute
  addDisputeEvidence(disputeId: number, evidence: {
    title: string;
    description: string;
    file?: File;
  }): Observable<DisputeEvidence> {
    const formData = new FormData();
    formData.append('title', evidence.title);
    formData.append('description', evidence.description);
    if (evidence.file) {
      formData.append('file', evidence.file);
    }

    return this.http.post<DisputeEvidence>(`${this.baseUrl}${disputeId}/evidence/`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Get dispute statistics
  getDisputeStats(params?: {
    start_date?: string;
    end_date?: string;
  }): Observable<DisputeStats> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<DisputeStats>(`${this.baseUrl}stats/`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user disputes (for current user)
  getUserDisputes(params?: {
    status?: string;
    type?: string;
  }): Observable<Dispute[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<Dispute[]>(`${this.baseUrl}my-disputes/`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  // Get dispute resolutions (alias for getDisputeResolutions)
  getResolutionHistory(disputeId: number): Observable<DisputeResolution[]> {
    return this.getDisputeResolutions(disputeId);
  }

  // Send message (alias for addDisputeMessage)
  sendMessage(disputeId: number, message: string, files?: File[]): Observable<DisputeMessage> {
    // For now, we'll just send the message. File attachments can be added separately
    return this.addDisputeMessage(disputeId, message);
  }

  // Get dispute resolutions
  getDisputeResolutions(disputeId: number): Observable<DisputeResolution[]> {
    return this.http.get<DisputeResolution[]>(`${this.baseUrl}${disputeId}/resolutions/`).pipe(
      catchError(this.handleError)
    );
  }

  // Helper methods
  getDisputeStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'open': 'danger',
      'in_progress': 'warning',
      'resolved': 'success',
      'closed': 'secondary'
    };
    return statusColors[status] || 'secondary';
  }

  getDisputePriorityColor(priority: string): string {
    const priorityColors: { [key: string]: string } = {
      'low': 'success',
      'medium': 'warning',
      'high': 'danger',
      'urgent': 'danger'
    };
    return priorityColors[priority] || 'secondary';
  }

  getDisputeTypeIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'payment': 'pi-dollar',
      'quality': 'pi-star',
      'deadline': 'pi-clock',
      'scope': 'pi-list',
      'other': 'pi-question'
    };
    return typeIcons[type] || 'pi-question';
  }

  formatDisputeDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Dispute service error:', error);
    let errorMessage = 'An error occurred';

    if (error.error?.detail) {
      errorMessage = error.error.detail;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
