import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse, Contract } from '../app/model/models';

export interface ContractFilters {
  status?: 'active' | 'completed' | 'cancelled';
  start_date_from?: string;
  start_date_to?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateContractData {
  proposal: number;
  start_date: string;
  end_date?: string;
  total_payment: number;
  deliverables?: string;
  milestones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private baseUrl = `${ApiConst.API_URL}contracts/contracts/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all contracts with optional filtering
   */
  getContracts(filters?: ContractFilters): Observable<ApiResponse<Contract>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ContractFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Contract>>(this.baseUrl, { params });
  }

  /**
   * Get a specific contract by ID
   */
  getContract(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}${id}/`);
  }

  /**
   * Create a new contract
   */
  createContract(contractData: CreateContractData): Observable<Contract> {
    return this.http.post<Contract>(this.baseUrl, contractData);
  }

  /**
   * Update an existing contract
   */
  updateContract(id: number, contractData: Partial<CreateContractData>): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseUrl}${id}/`, contractData);
  }

  /**
   * Get contracts for current user
   */
  getMyContracts(): Observable<ApiResponse<Contract>> {
    return this.http.get<ApiResponse<Contract>>(`${this.baseUrl}my-contracts/`);
  }

  /**
   * Get active contracts
   */
  getActiveContracts(): Observable<ApiResponse<Contract>> {
    let params = new HttpParams().set('status', 'active');
    return this.http.get<ApiResponse<Contract>>(this.baseUrl, { params });
  }

  /**
   * Complete a contract
   */
  completeContract(id: number): Observable<Contract> {
    return this.http.patch<Contract>(`${this.baseUrl}${id}/complete/`, {});
  }

  /**
   * Cancel a contract
   */
  cancelContract(id: number, reason?: string): Observable<Contract> {
    const data = reason ? { cancellation_reason: reason } : {};
    return this.http.patch<Contract>(`${this.baseUrl}${id}/cancel/`, data);
  }

  /**
   * Extend contract deadline
   */
  extendContract(id: number, newEndDate: string): Observable<Contract> {
    return this.http.patch<Contract>(`${this.baseUrl}${id}/extend/`, { 
      end_date: newEndDate 
    });
  }

  /**
   * Get contract statistics
   */
  getContractStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}stats/`);
  }

  /**
   * Upload contract document
   */
  uploadContractDocument(contractId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('document', file);
    return this.http.post(`${this.baseUrl}${contractId}/upload-document/`, formData);
  }

  /**
   * Get contract documents
   */
  getContractDocuments(contractId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}${contractId}/documents/`);
  }

  /**
   * Download contract PDF
   */
  downloadContractPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${id}/download_pdf/`, { 
      responseType: 'blob' 
    });
  }

  /**
   * Helper method to trigger PDF download in browser
   */
  downloadPDF(id: number, filename?: string): void {
    this.downloadContractPDF(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || `contract-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
      }
    });
  }
} 