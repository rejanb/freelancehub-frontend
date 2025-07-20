import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { Milestone } from '../app/model/models';

@Injectable({
  providedIn: 'root'
})
export class MilestoneService {
  private baseUrl = `${ApiConst.API_URL}contracts/`;

  constructor(private http: HttpClient) {}

  /**
   * Get milestones for a contract
   */
  getContractMilestones(contractId: number): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.baseUrl}${contractId}/milestones/`);
  }

  /**
   * Create a milestone for a contract
   */
  createMilestone(contractId: number, milestoneData: Partial<Milestone>): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.baseUrl}${contractId}/milestones/`, milestoneData);
  }

  /**
   * Update a milestone
   */
  updateMilestone(contractId: number, milestoneId: number, milestoneData: Partial<Milestone>): Observable<Milestone> {
    return this.http.put<Milestone>(
      `${this.baseUrl}${contractId}/milestones/${milestoneId}/`,
      milestoneData
    );
  }

  /**
   * Update milestone status
   */
  updateMilestoneStatus(contractId: number, milestoneId: number, status: string): Observable<Milestone> {
    return this.http.patch<Milestone>(
      `${this.baseUrl}${contractId}/milestones/${milestoneId}/`,
      { status }
    );
  }

  /**
   * Complete a milestone
   */
  completeMilestone(contractId: number, milestoneId: number): Observable<Milestone> {
    return this.http.patch<Milestone>(
      `${this.baseUrl}${contractId}/milestones/${milestoneId}/complete/`,
      {}
    );
  }

  /**
   * Release milestone payment
   */
  releaseMilestonePayment(contractId: number, milestoneId: number): Observable<Milestone> {
    return this.http.patch<Milestone>(
      `${this.baseUrl}${contractId}/milestones/${milestoneId}/pay/`,
      {}
    );
  }
} 