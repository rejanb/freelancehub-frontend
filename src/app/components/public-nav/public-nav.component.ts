import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-public-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenubarModule],
  template: `
    <div class="public-nav bg-white border-bottom-1 border-200 sticky top-0 z-5">
      <div class="container mx-auto px-4">
        <div class="flex justify-content-between align-items-center py-3">
          <!-- Logo -->
          <div class="flex align-items-center">
            <i class="pi pi-briefcase text-primary text-2xl mr-2"></i>
            <span class="text-2xl font-bold text-primary">freelancehub</span>
          </div>

          <!-- Navigation Links -->
          <div class="flex align-items-center gap-4">
            <a routerLink="/home" 
               routerLinkActive="text-primary font-semibold"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-600 hover:text-primary no-underline transition-colors">
              Home
            </a>
            <a routerLink="/jobs" 
               routerLinkActive="text-primary font-semibold"
               class="text-600 hover:text-primary no-underline transition-colors">
              Browse Jobs
            </a>
            <a routerLink="/projects" 
               routerLinkActive="text-primary font-semibold"
               class="text-600 hover:text-primary no-underline transition-colors">
              Browse Projects
            </a>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button pButton 
                    label="Log In" 
                    routerLink="/login"
                    class="p-button-outlined p-button-sm">
            </button>
            <button pButton 
                    label="Sign Up" 
                    routerLink="/register"
                    class="p-button-sm">
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .no-underline {
      text-decoration: none;
    }
    
    .transition-colors {
      transition: color 0.2s ease-in-out;
    }
  `]
})
export class PublicNavComponent {}
