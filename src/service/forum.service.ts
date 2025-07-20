import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  topic_count: number;
  post_count: number;
  last_activity?: string;
}

export interface ForumTopic {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
  };
  view_count: number;
  reply_count: number;
  like_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  is_solved: boolean;
  created_at: string;
  updated_at: string;
  last_reply?: {
    id: number;
    author: {
      id: number;
      name: string;
      avatar?: string;
    };
    created_at: string;
  };
}

export interface ForumPost {
  id: number;
  topic_id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
    role: string;
  };
  like_count: number;
  is_solution: boolean;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  author?: number;
  is_solved?: boolean;
  sort_by?: 'latest' | 'popular' | 'unanswered';
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private baseUrl = `${ApiConst.API_URL}forum/`;

  constructor(private http: HttpClient) {}

  /**
   * Get all forum categories
   */
  getCategories(): Observable<ForumCategory[]> {
    return this.http.get<ForumCategory[]>(`${this.baseUrl}categories/`);
  }

  /**
   * Get topics by category
   */
  getTopicsByCategory(category: string, filters?: SearchFilters): Observable<ApiResponse<ForumTopic>> {
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

    return this.http.get<ApiResponse<ForumTopic>>(`${this.baseUrl}topics/`, { params });
  }

  /**
   * Get topic by slug
   */
  getTopic(slug: string): Observable<ForumTopic> {
    return this.http.get<ForumTopic>(`${this.baseUrl}topics/${slug}/`);
  }

  /**
   * Create new topic
   */
  createTopic(topicData: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    attachments?: File[];
  }): Observable<ForumTopic> {
    const formData = new FormData();
    
    Object.keys(topicData).forEach(key => {
      const value = topicData[key as keyof typeof topicData];
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach(file => {
            formData.append('attachments', file);
          });
        } else if (key === 'tags' && Array.isArray(value)) {
          value.forEach(tag => {
            formData.append('tags', tag);
          });
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.post<ForumTopic>(`${this.baseUrl}topics/`, formData);
  }

  /**
   * Update topic
   */
  updateTopic(slug: string, topicData: {
    title?: string;
    content?: string;
    category?: string;
    tags?: string[];
  }): Observable<ForumTopic> {
    return this.http.patch<ForumTopic>(`${this.baseUrl}topics/${slug}/`, topicData);
  }

  /**
   * Delete topic
   */
  deleteTopic(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}topics/${slug}/`);
  }

  /**
   * Get posts for a topic
   */
  getPosts(topicId: number, page = 1, pageSize = 10): Observable<ApiResponse<ForumPost>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<ApiResponse<ForumPost>>(`${this.baseUrl}topics/${topicId}/posts/`, { params });
  }

  /**
   * Create post
   */
  createPost(topicId: number, postData: {
    content: string;
    attachments?: File[];
  }): Observable<ForumPost> {
    const formData = new FormData();
    formData.append('content', postData.content);
    
    if (postData.attachments) {
      postData.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    return this.http.post<ForumPost>(`${this.baseUrl}topics/${topicId}/posts/`, formData);
  }

  /**
   * Update post
   */
  updatePost(postId: number, content: string): Observable<ForumPost> {
    return this.http.patch<ForumPost>(`${this.baseUrl}posts/${postId}/`, { content });
  }

  /**
   * Delete post
   */
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}posts/${postId}/`);
  }

  /**
   * Mark post as solution
   */
  markAsSolution(topicId: number, postId: number): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}topics/${topicId}/solution/`, { post_id: postId });
  }

  /**
   * Like/unlike topic
   */
  toggleTopicLike(slug: string): Observable<{ liked: boolean; like_count: number }> {
    return this.http.post<{ liked: boolean; like_count: number }>(
      `${this.baseUrl}topics/${slug}/like/`,
      {}
    );
  }

  /**
   * Like/unlike post
   */
  togglePostLike(postId: number): Observable<{ liked: boolean; like_count: number }> {
    return this.http.post<{ liked: boolean; like_count: number }>(
      `${this.baseUrl}posts/${postId}/like/`,
      {}
    );
  }

  /**
   * Search topics
   */
  searchTopics(query: string, filters?: SearchFilters): Observable<ApiResponse<ForumTopic>> {
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

    return this.http.get<ApiResponse<ForumTopic>>(`${this.baseUrl}topics/search/`, { params });
  }

  /**
   * Get trending topics
   */
  getTrendingTopics(): Observable<ForumTopic[]> {
    return this.http.get<ForumTopic[]>(`${this.baseUrl}topics/trending/`);
  }

  /**
   * Get user's topics
   */
  getUserTopics(userId: number): Observable<ForumTopic[]> {
    return this.http.get<ForumTopic[]>(`${this.baseUrl}users/${userId}/topics/`);
  }

  /**
   * Get user's posts
   */
  getUserPosts(userId: number): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.baseUrl}users/${userId}/posts/`);
  }

  /**
   * Pin/unpin topic
   */
  toggleTopicPin(slug: string): Observable<ForumTopic> {
    return this.http.post<ForumTopic>(`${this.baseUrl}topics/${slug}/pin/`, {});
  }

  /**
   * Lock/unlock topic
   */
  toggleTopicLock(slug: string): Observable<ForumTopic> {
    return this.http.post<ForumTopic>(`${this.baseUrl}topics/${slug}/lock/`, {});
  }

  /**
   * Download attachment
   */
  downloadAttachment(attachmentId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}attachments/${attachmentId}/`, {
      responseType: 'blob'
    });
  }

  /**
   * Report topic/post
   */
  report(type: 'topic' | 'post', id: number, reason: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${type}s/${id}/report/`, { reason });
  }
} 