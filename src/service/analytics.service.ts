import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';

export interface EarningsStats {
  total_earnings: number;
  earnings_this_month: number;
  earnings_last_month: number;
  earnings_growth: number;
  monthly_earnings: {
    month: string;
    amount: number;
    completed_jobs: number;
  }[];
  earnings_by_category: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  average_hourly_rate: number;
  pending_payments: number;
}

export interface JobStats {
  total_jobs: number;
  active_jobs: number;
  completed_jobs: number;
  cancelled_jobs: number;
  success_rate: number;
  average_job_duration: number;
  jobs_by_status: {
    status: string;
    count: number;
    percentage: number;
  }[];
  jobs_by_category: {
    category: string;
    count: number;
    percentage: number;
  }[];
  monthly_jobs: {
    month: string;
    posted: number;
    completed: number;
  }[];
}

export interface ClientStats {
  total_spent: number;
  active_contracts: number;
  completed_contracts: number;
  total_freelancers: number;
  average_rating_given: number;
  monthly_spending: {
    month: string;
    amount: number;
    contracts: number;
  }[];
  spending_by_category: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  top_freelancers: {
    freelancer_id: number;
    name: string;
    contracts: number;
    total_spent: number;
    average_rating: number;
  }[];
}

export interface FreelancerStats {
  total_earnings: number;
  active_contracts: number;
  completed_contracts: number;
  total_clients: number;
  average_rating_received: number;
  monthly_earnings: {
    month: string;
    amount: number;
    contracts: number;
  }[];
  earnings_by_category: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  top_clients: {
    client_id: number;
    name: string;
    contracts: number;
    total_earnings: number;
    average_rating: number;
  }[];
}

export interface ProposalStats {
  total_proposals: number;
  accepted_proposals: number;
  rejected_proposals: number;
  pending_proposals: number;
  acceptance_rate: number;
  average_response_time: number;
  proposals_by_status: {
    status: string;
    count: number;
    percentage: number;
  }[];
  monthly_proposals: {
    month: string;
    sent: number;
    accepted: number;
  }[];
}

export interface ContractStats {
  total_contracts: number;
  active_contracts: number;
  completed_contracts: number;
  cancelled_contracts: number;
  completion_rate: number;
  average_contract_value: number;
  contracts_by_status: {
    status: string;
    count: number;
    percentage: number;
  }[];
  monthly_contracts: {
    month: string;
    started: number;
    completed: number;
  }[];
}

export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  category?: string;
  status?: string;
  client_id?: number;
  freelancer_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = `${ApiConst.API_URL}analytics/`;

  constructor(private http: HttpClient) {}

  /**
   * Get earnings statistics
   */
  getEarningsStats(filters?: AnalyticsFilters): Observable<EarningsStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<EarningsStats>(`${this.baseUrl}earnings/`, { params });
  }

  /**
   * Get job statistics
   */
  getJobStats(filters?: AnalyticsFilters): Observable<JobStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<JobStats>(`${this.baseUrl}jobs/`, { params });
  }

  /**
   * Get client statistics
   */
  getClientStats(filters?: AnalyticsFilters): Observable<ClientStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ClientStats>(`${this.baseUrl}client/`, { params });
  }

  /**
   * Get freelancer statistics
   */
  getFreelancerStats(filters?: AnalyticsFilters): Observable<FreelancerStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<FreelancerStats>(`${this.baseUrl}freelancer/`, { params });
  }

  /**
   * Get proposal statistics
   */
  getProposalStats(filters?: AnalyticsFilters): Observable<ProposalStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProposalStats>(`${this.baseUrl}proposals/`, { params });
  }

  /**
   * Get contract statistics
   */
  getContractStats(filters?: AnalyticsFilters): Observable<ContractStats> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ContractStats>(`${this.baseUrl}contracts/`, { params });
  }

  /**
   * Export analytics data
   */
  exportAnalytics(type: string, format: 'csv' | 'pdf', filters?: AnalyticsFilters): Observable<Blob> {
    let params = new HttpParams()
      .set('type', type)
      .set('format', format);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof AnalyticsFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get(`${this.baseUrl}export/`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights(): Observable<{
    insights: string[];
    recommendations: string[];
  }> {
    return this.http.get<{
      insights: string[];
      recommendations: string[];
    }>(`${this.baseUrl}insights/`);
  }

  /**
   * Get category performance
   */
  getCategoryPerformance(): Observable<{
    category: string;
    jobs: number;
    earnings: number;
    success_rate: number;
    growth: number;
  }[]> {
    return this.http.get<{
      category: string;
      jobs: number;
      earnings: number;
      success_rate: number;
      growth: number;
    }[]>(`${this.baseUrl}categories/`);
  }

  /**
   * Get platform metrics
   */
  getPlatformMetrics(): Observable<{
    total_users: number;
    active_users: number;
    total_jobs: number;
    total_contracts: number;
    total_earnings: number;
    user_growth: number;
    job_growth: number;
    earnings_growth: number;
  }> {
    return this.http.get<{
      total_users: number;
      active_users: number;
      total_jobs: number;
      total_contracts: number;
      total_earnings: number;
      user_growth: number;
      job_growth: number;
      earnings_growth: number;
    }>(`${this.baseUrl}platform/`);
  }
} 