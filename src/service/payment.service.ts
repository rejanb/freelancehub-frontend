import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse, Payment } from '../app/model/models';

export interface PaymentFilters {
  status?: 'pending' | 'completed' | 'failed';
  type?: 'milestone' | 'escrow' | 'withdrawal';
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  contract?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface WithdrawalRequest {
  amount: number;
  payment_method: string;
  account_details: {
    account_number?: string;
    routing_number?: string;
    account_name?: string;
    bank_name?: string;
    swift_code?: string;
    paypal_email?: string;
  };
}

export interface PaymentMethodResponse {
  id: string;
  type: string;
  last4?: string;
  exp_month?: number;
  exp_year?: number;
  brand?: string;
  is_default: boolean;
  created_at: string;
}

export interface PaymentStats {
  total_earnings: number;
  total_spent: number;
  pending_payments: number;
  available_balance: number;
  monthly_earnings: { month: string; amount: number }[];
  payment_methods: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${ApiConst.API_URL}payments/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all payments with optional filtering
   */
  getPayments(filters?: PaymentFilters): Observable<ApiResponse<Payment>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof PaymentFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Payment>>(this.baseUrl, { params });
  }

  /**
   * Get a specific payment by ID
   */
  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}${id}/`);
  }

  /**
   * Get payment statistics (minimal dev version)
   */
  getPaymentStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}stats/`);
  }

  /**
   * Request withdrawal
   */
  requestWithdrawal(data: WithdrawalRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}withdraw/`, data);
  }

  /**
   * Get payment methods
   */
  getPaymentMethods(): Observable<PaymentMethodResponse[]> {
    return this.http.get<PaymentMethodResponse[]>(`${this.baseUrl}methods/`);
  }

  /**
   * Add payment method
   */
  addPaymentMethod(token: string): Observable<PaymentMethodResponse> {
    return this.http.post<PaymentMethodResponse>(`${this.baseUrl}methods/`, { token });
  }

  /**
   * Remove payment method
   */
  removePaymentMethod(methodId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}methods/${methodId}/`);
  }

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod(methodId: string): Observable<PaymentMethodResponse> {
    return this.http.post<PaymentMethodResponse>(
      `${this.baseUrl}methods/${methodId}/set-default/`,
      {}
    );
  }

  /**
   * Process milestone payment
   */
  processMilestonePayment(milestoneId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}milestone/${milestoneId}/`, {});
  }

  /**
   * Process escrow payment
   */
  processEscrowPayment(contractId: number, amount: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}escrow/`, {
      contract: contractId,
      amount
    });
  }

  /**
   * Release escrow payment
   */
  releaseEscrowPayment(paymentId: number): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}${paymentId}/release/`, {});
  }

  /**
   * Refund payment
   */
  refundPayment(paymentId: number, reason?: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}${paymentId}/refund/`, {
      reason
    });
  }

  /**
   * Get available balance
   */
  getAvailableBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.baseUrl}balance/`);
  }

  /**
   * Get payment receipt
   */
  getPaymentReceipt(paymentId: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}${paymentId}/receipt/`);
  }

  /**
   * Create quick test payment (for dev/testing)
   */
  createQuickPayment(data: {
    amount: number;
    description: string;
    contract_id?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}quick-pay/`, data);
  }
} 