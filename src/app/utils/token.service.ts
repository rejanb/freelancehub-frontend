import { Injectable } from '@angular/core';
import {ApiConst} from '../const/api-const';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }



  /**
   * Sets data in local storage under the specified key.
   * @param key - The key to store the data under.
   * @param data - The data to be stored.
   */
  setLocal(key: string, data: unknown): void {
    console.log(data)
    console.log(JSON.stringify(data))
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e){
      console.error('Error saving to local storage', e)
    }
  }

  /**
   * Retrieves data from local storage using the specified key.
   * @param key - The key of the data to retrieve.
   * @returns The retrieved data if present, otherwise null.
   */
  getLocal(key: string): unknown {
    try {
      const localStorageItem:any =  localStorage.getItem(key);
      return localStorageItem ? JSON.parse(localStorageItem) : null;
    } catch (e){
      // console.log(e)
      // console.error('Error getting from local storage', e);
      return null
    }
  }

  /**
   * Removes data from local storage using the specified key.
   * @param key - The key of the data to remove.
   */
  clearLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e){
      console.error('Error saving to local storage', e)
    }
  }

  /**
   * Checks if a user is logged in by checking for the presence of a user data in local storage.
   * @returns True if a user is logged in, false otherwise.
   */
  // isLoggedIn(): boolean {
  //     return !!this.getLocal(ApiConst.CURRENT_USER);
  // }

  /**
   * get the current user
   */
  getCurrentUser(): any {
    return this.getLocal(ApiConst.userKey);
  }

  getToken(): any {
    return this.getLocal(ApiConst.tokenKey);
  }

  /**
   * Get the current user's role
   */
  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.type || '';
  }

  /**
   * Get the current user's ID
   */
  getUserId(): number {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
