import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface Review {
  id: number;
  contract: number;
  reviewer: number;
  reviewee: number;
  rating: number;
  review_text: string;
  communication_rating: number;
  quality_rating: number;
  timeliness_rating: number;
  professionalism_rating: number;
  would_recommend: boolean;
  created_at: string;
  updated_at: string;
  reviewer_name?: string;
  reviewee_name?: string;
  contract_title?: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: { [key: number]: number };
  average_communication: number;
  average_quality: number;
  average_timeliness: number;
  average_professionalism: number;
  recommendation_percentage: number;
  recent_reviews: Review[];
}

export interface ReviewFilters {
  contract?: number;
  reviewer?: number;
  reviewee?: number;
  min_rating?: number;
  max_rating?: number;
  start_date?: string;
  end_date?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = `${ApiConst.API_URL}reviews/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all reviews with optional filtering
   */
  getReviews(filters?: ReviewFilters): Observable<ApiResponse<Review>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ReviewFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Review>>(this.baseUrl, { params });
  }

  /**
   * Get a specific review by ID
   */
  getReview(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}${id}/`);
  }

  /**
   * Create a new review
   */
  createReview(reviewData: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, reviewData);
  }

  /**
   * Update an existing review
   */
  updateReview(id: number, reviewData: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${this.baseUrl}${id}/`, reviewData);
  }

  /**
   * Delete a review
   */
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }

  /**
   * Get review statistics for a user
   */
  getReviewStats(userId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.baseUrl}stats/${userId}/`);
  }

  /**
   * Get reviews given by current user
   */
  getReviewsGiven(): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.baseUrl}given/`);
  }

  /**
   * Get reviews received by current user
   */
  getReviewsReceived(): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.baseUrl}received/`);
  }

  /**
   * Check if user can review a contract
   */
  canReview(contractId: number): Observable<{ can_review: boolean }> {
    return this.http.get<{ can_review: boolean }>(`${this.baseUrl}can-review/${contractId}/`);
  }

  /**
   * Report an inappropriate review
   */
  reportReview(reviewId: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${reviewId}/report/`, { reason });
  }

  /**
   * Get review summary for a contract
   */
  getContractReviewSummary(contractId: number): Observable<{
    client_review?: Review;
    freelancer_review?: Review;
  }> {
    return this.http.get<{
      client_review?: Review;
      freelancer_review?: Review;
    }>(`${this.baseUrl}contract/${contractId}/`);
  }

  /**
   * Get top rated freelancers
   */
  getTopRatedFreelancers(limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}top-rated/`, {
      params: { limit: limit.toString() }
    });
  }
} 