import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';

export interface AccountSettings {
  email: string;
  phone?: string;
  timezone: string;
  language: string;
  currency: string;
  profile_visibility: 'public' | 'private' | 'contacts_only';
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  available_for_hire: boolean;
  profile_completion: number;
}

export interface SecuritySettings {
  last_password_change: string;
  login_history: {
    date: string;
    ip: string;
    device: string;
    location: string;
    success: boolean;
  }[];
  active_sessions: {
    id: string;
    device: string;
    location: string;
    last_active: string;
    current: boolean;
  }[];
  two_factor_method: 'none' | 'email' | 'authenticator' | 'sms';
}

export interface NotificationSettings {
  email_notifications: {
    new_messages: boolean;
    job_alerts: boolean;
    proposal_updates: boolean;
    contract_updates: boolean;
    payment_updates: boolean;
    review_received: boolean;
    dispute_updates: boolean;
    platform_updates: boolean;
    marketing_emails: boolean;
  };
  push_notifications: {
    new_messages: boolean;
    job_alerts: boolean;
    proposal_updates: boolean;
    contract_updates: boolean;
    payment_updates: boolean;
    review_received: boolean;
    dispute_updates: boolean;
    platform_updates: boolean;
  };
  notification_frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

export interface BillingSettings {
  default_payment_method: {
    id: string;
    type: 'card' | 'bank_account' | 'paypal';
    last4: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
  };
  auto_recharge: boolean;
  recharge_threshold?: number;
  recharge_amount?: number;
  tax_information : {
    tax_id_type: string;
    tax_id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'contacts_only';
  show_earnings: boolean;
  show_portfolio: boolean;
  show_reviews: boolean;
  show_online_status: boolean;
  searchable: boolean;
  data_sharing: {
    share_profile_data: boolean;
    share_usage_data: boolean;
    share_for_recommendations: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = `${ApiConst.API_URL}settings/`;

  constructor(private http: HttpClient) {}

  /**
   * Get account settings
   */
  getAccountSettings(): Observable<AccountSettings> {
    return this.http.get<AccountSettings>(`${this.baseUrl}account/`);
  }

  /**
   * Update account settings
   */
  updateAccountSettings(settings: Partial<AccountSettings>): Observable<AccountSettings> {
    return this.http.patch<AccountSettings>(`${this.baseUrl}account/`, settings);
  }

  /**
   * Get security settings
   */
  getSecuritySettings(): Observable<SecuritySettings> {
    return this.http.get<SecuritySettings>(`${this.baseUrl}security/`);
  }

  /**
   * Enable two-factor authentication
   */
  enableTwoFactor(method: 'email' | 'authenticator' | 'sms'): Observable<{
    success: boolean;
    setup_required: boolean;
    setup_data?: any;
  }> {
    return this.http.post<{
      success: boolean;
      setup_required: boolean;
      setup_data?: any;
    }>(`${this.baseUrl}security/two-factor/enable/`, { method });
  }

  /**
   * Disable two-factor authentication
   */
  disableTwoFactor(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}security/two-factor/disable/`, {});
  }

  /**
   * Verify two-factor setup
   */
  verifyTwoFactorSetup(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}security/two-factor/verify/`, { code });
  }

  /**
   * Get notification settings
   */
  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.baseUrl}notifications/`);
  }

  /**
   * Update notification settings
   */
  updateNotificationSettings(settings: Partial<NotificationSettings>): Observable<NotificationSettings> {
    return this.http.patch<NotificationSettings>(`${this.baseUrl}notifications/`, settings);
  }

  /**
   * Get billing settings
   */
  getBillingSettings(): Observable<BillingSettings> {
    return this.http.get<BillingSettings>(`${this.baseUrl}billing/`);
  }

  /**
   * Update billing settings
   */
  updateBillingSettings(settings: Partial<BillingSettings>): Observable<BillingSettings> {
    return this.http.patch<BillingSettings>(`${this.baseUrl}billing/`, settings);
  }

  /**
   * Get privacy settings
   */
  getPrivacySettings(): Observable<PrivacySettings> {
    return this.http.get<PrivacySettings>(`${this.baseUrl}privacy/`);
  }

  /**
   * Update privacy settings
   */
  updatePrivacySettings(settings: Partial<PrivacySettings>): Observable<PrivacySettings> {
    return this.http.patch<PrivacySettings>(`${this.baseUrl}privacy/`, settings);
  }

  /**
   * Request email verification
   */
  requestEmailVerification(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}account/verify-email/`, {});
  }

  /**
   * Verify email with code
   */
  verifyEmail(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}account/verify-email/${code}/`, {});
  }

  /**
   * Request phone verification
   */
  requestPhoneVerification(phone: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}account/verify-phone/`, { phone });
  }

  /**
   * Verify phone with code
   */
  verifyPhone(code: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}account/verify-phone/${code}/`, {});
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}security/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.baseUrl}security/sessions/${sessionId}/revoke/`,
      {}
    );
  }

  /**
   * Get account data export
   */
  exportAccountData(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}privacy/export/`, {
      responseType: 'blob'
    });
  }

  /**
   * Request account deletion
   */
  requestAccountDeletion(reason: string): Observable<{ success: boolean; deletion_date: string }> {
    return this.http.post<{ success: boolean; deletion_date: string }>(
      `${this.baseUrl}account/delete/`,
      { reason }
    );
  }

  /**
   * Cancel account deletion request
   */
  cancelAccountDeletion(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}account/delete/cancel/`, {});
  }
}
