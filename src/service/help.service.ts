import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  subcategory?: string;
  tags: string[];
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
  related_articles: number[];
}

export interface ArticleCategory {
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: {
    name: string;
    slug: string;
    description: string;
  }[];
  article_count: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: number;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  attachments?: string[];
  messages: {
    id: number;
    sender_type: 'user' | 'support';
    message: string;
    attachments?: string[];
    created_at: string;
  }[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  attachments?: File[];
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  tags?: string[];
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private baseUrl = `${ApiConst.API_URL}help/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all article categories
   */
  getCategories(): Observable<ArticleCategory[]> {
    return this.http.get<ArticleCategory[]>(`${this.baseUrl}categories/`);
  }

  /**
   * Get articles by category
   */
  getArticlesByCategory(category: string, filters?: SearchFilters): Observable<ApiResponse<Article>> {
    let params = new HttpParams().set('category', category);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof SearchFilters];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => {
              params = params.append(key, v);
            });
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ApiResponse<Article>>(`${this.baseUrl}articles/`, { params });
  }

  /**
   * Get article by slug
   */
  getArticle(slug: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}articles/${slug}/`);
  }

  /**
   * Search articles
   */
  searchArticles(query: string, filters?: SearchFilters): Observable<ApiResponse<Article>> {
    let params = new HttpParams().set('search', query);
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof SearchFilters];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => {
              params = params.append(key, v);
            });
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ApiResponse<Article>>(`${this.baseUrl}articles/search/`, { params });
  }

  /**
   * Rate article helpfulness
   */
  rateArticle(slug: string, helpful: boolean): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}articles/${slug}/rate/`, { helpful });
  }

  /**
   * Get FAQs by category
   */
  getFAQs(category?: string): Observable<FAQ[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<FAQ[]>(`${this.baseUrl}faqs/`, { params });
  }

  /**
   * Rate FAQ helpfulness
   */
  rateFAQ(id: number, helpful: boolean): Observable<FAQ> {
    return this.http.post<FAQ>(`${this.baseUrl}faqs/${id}/rate/`, { helpful });
  }

  /**
   * Get user's support tickets
   */
  getTickets(): Observable<SupportTicket[]> {
    return this.http.get<SupportTicket[]>(`${this.baseUrl}tickets/`);
  }

  /**
   * Get specific ticket
   */
  getTicket(id: number): Observable<SupportTicket> {
    return this.http.get<SupportTicket>(`${this.baseUrl}tickets/${id}/`);
  }

  /**
   * Create support ticket
   */
  createTicket(ticketData: {
    subject: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    attachments?: File[];
  }): Observable<SupportTicket> {
    const formData = new FormData();
    
    Object.keys(ticketData).forEach(key => {
      const value = ticketData[key as keyof typeof ticketData];
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach(file => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.post<SupportTicket>(`${this.baseUrl}tickets/`, formData);
  }

  /**
   * Add message to ticket
   */
  addTicketMessage(ticketId: number, message: string, attachments?: File[]): Observable<SupportTicket> {
    const formData = new FormData();
    formData.append('message', message);
    
    if (attachments) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return this.http.post<SupportTicket>(`${this.baseUrl}tickets/${ticketId}/messages/`, formData);
  }

  /**
   * Close ticket
   */
  closeTicket(ticketId: number): Observable<SupportTicket> {
    return this.http.post<SupportTicket>(`${this.baseUrl}tickets/${ticketId}/close/`, {});
  }

  /**
   * Reopen ticket
   */
  reopenTicket(ticketId: number): Observable<SupportTicket> {
    return this.http.post<SupportTicket>(`${this.baseUrl}tickets/${ticketId}/reopen/`, {});
  }

  /**
   * Submit contact form
   */
  submitContactForm(formData: ContactForm): Observable<{ success: boolean; ticket_id?: number }> {
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof ContactForm];
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach(file => {
            data.append('attachments', file);
          });
        } else {
          data.append(key, value.toString());
        }
      }
    });

    return this.http.post<{ success: boolean; ticket_id?: number }>(
      `${this.baseUrl}contact/`,
      data
    );
  }

  /**
   * Download attachment
   */
  downloadAttachment(ticketId: number, attachmentId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}tickets/${ticketId}/attachments/${attachmentId}/`, {
      responseType: 'blob'
    });
  }

  /**
   * Get suggested articles based on text
   */
  getSuggestedArticles(text: string): Observable<Article[]> {
    return this.http.post<Article[]>(`${this.baseUrl}articles/suggest/`, { text });
  }
} 