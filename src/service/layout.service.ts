import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserPreferences {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private readonly PREFERENCES_KEY = 'user_preferences';

  private sidebarState = new BehaviorSubject<boolean>(true);
  private userPreferences = new BehaviorSubject<UserPreferences>(this.getDefaultPreferences());

  constructor() {
    this.loadPreferences();
  }

  // Sidebar state management
  get sidebarState$(): Observable<boolean> {
    return this.sidebarState.asObservable();
  }

  toggleSidebar(): void {
    const currentState = this.sidebarState.value;
    this.sidebarState.next(!currentState);
    this.savePreference('sidebarCollapsed', !currentState);
  }

  setSidebarState(isOpen: boolean): void {
    this.sidebarState.next(isOpen);
    this.savePreference('sidebarCollapsed', !isOpen);
  }

  // User preferences management
  get userPreferences$(): Observable<UserPreferences> {
    return this.userPreferences.asObservable();
  }

  updatePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.userPreferences.value;
    const updated = { ...current, ...preferences };
    this.userPreferences.next(updated);
    this.savePreferences(updated);
  }

  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.userPreferences.value[key];
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      sidebarCollapsed: false,
      theme: 'light',
      notificationsEnabled: true,
      language: 'en'
    };
  }

  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        const preferences = JSON.parse(stored);
        this.userPreferences.next({ ...this.getDefaultPreferences(), ...preferences });
        this.sidebarState.next(!preferences.sidebarCollapsed);
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  }

  private savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save user preferences:', error);
    }
  }

  private savePreference<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ): void {
    const current = this.userPreferences.value;
    const updated = { ...current, [key]: value };
    this.updatePreferences(updated);
  }

  // Theme management
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.updatePreferences({ theme });
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      body.classList.add(`${theme}-theme`);
    }
  }

  // Mobile responsiveness
  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  // Menu state for different user types
  getMenuVisibility(userType: string, menuItem: string): boolean {
    const visibilityRules: Record<string, string[]> = {
      'client': [
        'post-job', 'my-jobs', 'received-proposals', 'payment-history', 
        'payment-methods', 'draft-contracts'
      ],
      'freelancer': [
        'my-proposals', 'saved-jobs', 'earnings', 'withdraw-funds', 
        'payment-history'
      ]
    };

    return visibilityRules[userType]?.includes(menuItem) || 
           ['overview', 'browse-jobs', 'active-contracts', 'completed-contracts', 
            'messages', 'notifications', 'disputes', 'reviews', 'profile', 'settings'].includes(menuItem);
  }
}
