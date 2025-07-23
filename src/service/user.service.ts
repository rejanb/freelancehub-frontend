import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConst } from '../app/const/api-const';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  user_type: 'client' | 'freelancer';
  bio?: string;
  skills: string[];
  profile_picture?: string;
  date_joined: string;
  last_login?: string;
}

export interface UpdateUserProfile {
  username?: string;
  email?: string;
  bio?: string;
  skills?: string[];
  profile_picture?: File;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${ApiConst.API_URL}users`;

  constructor(private http: HttpClient) {}

  /**
   * Get current user profile
   */
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/`);
  }

  /**
   * Update user profile
   */
  updateUserProfile(profileData: UpdateUserProfile): Observable<UserProfile> {
    const formData = new FormData();

    Object.keys(profileData).forEach(key => {
      const value = profileData[key as keyof UpdateUserProfile];
      if (value !== undefined && value !== null) {
        if (key === 'skills' && Array.isArray(value)) {
          formData.append('skills', JSON.stringify(value));
        } else if (key === 'profile_picture' && value instanceof File) {
          formData.append('profile_picture', value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return this.http.patch<UserProfile>(`${this.apiUrl}/profile/`, formData);
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/change-password/`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  /**
   * Delete user account
   */
  deleteAccount(): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/profile/`);
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<{profile_picture: string}> {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    return this.http.post<{profile_picture: string}>(`${this.apiUrl}/upload-picture/`, formData);
  }
}
