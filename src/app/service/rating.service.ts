import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConst } from '../const/api-const';
import { Rating, RatingSummary, PendingRating, RatingRequest } from '../model/rating.models';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) {}

  // Get user's rating summary
  getRatingSummary(userId?: number): Observable<RatingSummary> {
    const url = userId 
      ? `${ApiConst.API_URL}reviews/ratings/summary/?user_id=${userId}`
      : `${ApiConst.API_URL}reviews/ratings/summary/`;
    return this.http.get<RatingSummary>(url);
  }

  // Get pending ratings for current user
  getPendingRatings(): Observable<PendingRating[]> {
    return this.http.get<PendingRating[]>(`${ApiConst.API_URL}reviews/ratings/pending/`);
  }

  // Submit a rating
  submitRating(ratingData: RatingRequest): Observable<Rating> {
    return this.http.post<Rating>(`${ApiConst.API_URL}reviews/ratings/submit/`, ratingData);
  }

  // Get ratings received by current user (or specific user)
  getReceivedRatings(page: number = 0, pageSize: number = 10, userId?: number): Observable<{results: Rating[], count: number, page: number, page_size: number, total_pages: number}> {
    let url = `${ApiConst.API_URL}reviews/ratings/received/?page=${page}&page_size=${pageSize}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }
    return this.http.get<{results: Rating[], count: number, page: number, page_size: number, total_pages: number}>(url);
  }

  // Get ratings given by current user
  getGivenRatings(page: number = 0, pageSize: number = 10): Observable<{results: Rating[], count: number, page: number, page_size: number, total_pages: number}> {
    return this.http.get<{results: Rating[], count: number, page: number, page_size: number, total_pages: number}>(`${ApiConst.API_URL}reviews/ratings/given/?page=${page}&page_size=${pageSize}`);
  }

  // Get all ratings (with filtering options)
  getRatings(page: number = 0, pageSize: number = 10, userId?: number, projectId?: number): Observable<{results: Rating[], count: number}> {
    let url = `${ApiConst.API_URL}reviews/ratings/?page=${page}&page_size=${pageSize}`;
    if (userId) {
      url += `&user_id=${userId}`;
    }
    if (projectId) {
      url += `&project_id=${projectId}`;
    }
    return this.http.get<{results: Rating[], count: number}>(url);
  }

  // Get specific rating by ID
  getRating(ratingId: number): Observable<Rating> {
    return this.http.get<Rating>(`${ApiConst.API_URL}reviews/ratings/${ratingId}/`);
  }

  // Update an existing rating
  updateRating(ratingId: number, ratingData: Partial<RatingRequest>): Observable<Rating> {
    return this.http.put<Rating>(`${ApiConst.API_URL}reviews/ratings/${ratingId}/`, ratingData);
  }

  // Delete a rating (if allowed)
  deleteRating(ratingId: number): Observable<void> {
    return this.http.delete<void>(`${ApiConst.API_URL}reviews/ratings/${ratingId}/`);
  }

  // Helper methods for specific use cases

  // Get freelancer's rating summary (backward compatibility)
  getFreelancerRating(freelancerId: number): Observable<RatingSummary> {
    return this.getRatingSummary(freelancerId);
  }

  // Get all ratings for a freelancer (backward compatibility)
  getFreelancerRatings(freelancerId: number, page: number = 0, limit: number = 10): Observable<{results: Rating[], count: number}> {
    return this.getRatings(page, limit, freelancerId);
  }

  // Check if user can rate a project
  canRateProject(projectId: number): Observable<{canRate: boolean, reason?: string}> {
    // This would need to be implemented based on pending ratings
    return this.getPendingRatings().pipe(
      map(pendingRatings => {
        const canRate = pendingRatings.some(pending => pending.project_id === projectId);
        return {
          canRate,
          reason: canRate ? undefined : 'No pending rating found for this project'
        };
      })
    );
  }

  // Get rating for a specific project
  getProjectRating(projectId: number): Observable<Rating | null> {
    return this.getRatings(0, 1, undefined, projectId).pipe(
      map(response => response.results.length > 0 ? response.results[0] : null)
    );
  }
}
