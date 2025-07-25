import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { PublicService } from '../../../../service/public.service';
import { PublicProject } from '../../../model/public.models';
import { PublicNavComponent } from '../../../components/public-nav/public-nav.component';

@Component({
  selector: 'app-public-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    DividerModule,
    PublicNavComponent
  ],
  template: `
    <app-public-nav></app-public-nav>
    <div class="public-project-detail-container">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center p-6">
        <p-progressSpinner></p-progressSpinner>
        <p>class="mt-3">Loading project details...</p>
      </div>

      <!-- Project Not Found -->
      <div *ngIf="!loading && !project" class="text-center p-6">
        <i class="pi pi-exclamation-triangle text-6xl text-400 mb-3"></i>
        <h3>Project Not Found</h3>
        <p class="text-600 mb-4">The project you're looking for doesn't exist or is no longer available.</p>
        <button pButton label="Browse All Projects" routerLink="/projects" class="p-button-outlined"></button>
      </div>

      <!-- Project Details -->
      <div *ngIf="!loading && project" class="container mx-auto px-4 py-6">
        <!-- Header -->
        <div class="card mb-4">
          <div class="flex justify-content-between align-items-start flex-wrap gap-3">
            <div class="flex-1">
              <div class="flex align-items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold m-0">{{ project.title }}</h1>
                <p-tag
                  *ngIf="project.is_featured"
                  value="Featured"
                  severity="warn"
                  icon="pi pi-star">
                </p-tag>
              </div>
              <div class="flex align-items-center gap-4 text-600">
                <span><i class="pi pi-user mr-2"></i>{{ project.client.username }}</span>
                <span><i class="pi pi-calendar mr-2"></i>Posted {{ project.created_at | date:'mediumDate' }}</span>
                <p-tag [value]="project.status" [severity]="getStatusSeverity(project.status)"></p-tag>
              </div>
            </div>

          </div>
        </div>

        <div class="grid">
          <!-- Main Content -->
          <div class="col-12 lg:col-8">
            <!-- Description -->
            <div class="card mb-4">
              <h2 class="text-xl font-semibold mb-3">Project Description</h2>
              <div class="text-700 line-height-3" [innerHTML]="project.description"></div>
            </div>

            <!-- Skills Required -->
            <div class="card mb-4" *ngIf="project.skills_required?.length">
              <h2 class="text-xl font-semibold mb-3">Skills Required</h2>
              <div class="flex flex-wrap gap-2">
                <p-tag
                  *ngFor="let skill of project.skills_required"
                  [value]="skill"
                  severity="info">
                </p-tag>
              </div>
            </div>

            <!-- Project Status -->
            <div class="card mb-4" *ngIf="project.selected_freelancer">
              <h2 class="text-xl font-semibold mb-3">Project Status</h2>
              <div class="flex align-items-center gap-3">
                <div class="flex align-items-center justify-content-center bg-green-100 text-green-800 border-round-lg"
                     style="width: 3rem; height: 3rem; font-size: 1.5rem;">
                  {{ project.selected_freelancer.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium">Assigned to {{ project.selected_freelancer.username }}</div>
                  <div class="text-600">This project is currently in progress</div>
                </div>
              </div>
            </div>

            <!-- Category -->
            <div class="card mb-4" *ngIf="project.category">
              <h2 class="text-xl font-semibold mb-3">Category</h2>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-tag text-blue-500"></i>
                <span class="font-medium">{{ project.category.name }}</span>
                <span class="text-600" *ngIf="project.category.description">- {{ project.category.description }}</span>
              </div>
            </div>

            <!-- Call to Action -->
            <div class="card text-center" *ngIf="project.status === 'open'">
              <h3 class="text-xl mb-3">Interested in this project?</h3>
              <p class="text-600 mb-4">Sign up or log in to submit your proposal</p>
              <div class="flex gap-3 justify-content-center">
                <button pButton label="Sign Up" routerLink="/register" class="p-button-success"></button>
                <button pButton label="Log In" routerLink="/login" class="p-button-outlined"></button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 lg:col-4">
            <!-- Project Details -->
            <div class="card mb-4">
              <h3 class="text-lg font-semibold mb-3">Project Details</h3>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Budget</span>
                <span class="text-green-600 font-bold">\${{ project.budget }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Deadline</span>
                <span>{{ project.deadline | date:'mediumDate' }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200" *ngIf="project.location">
                <span class="font-medium">Location</span>
                <span>{{ project.location }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Status</span>
                <p-tag [value]="project.status" [severity]="getStatusSeverity(project.status)"></p-tag>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200" *ngIf="project.category">
                <span class="font-medium">Category</span>
                <span>{{ project.category.name }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2">
                <span class="font-medium">Posted</span>
                <span>{{ project.created_at | date:'mediumDate' }}</span>
              </div>
            </div>

            <!-- Client Info -->
            <div class="card mb-4">
              <h3 class="text-lg font-semibold mb-3">About the Client</h3>

              <div class="flex align-items-center gap-3 mb-3">
                <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-800 border-round-lg"
                     style="width: 3rem; height: 3rem; font-size: 1.5rem;">
                  {{ project.client.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium">{{ project.client.username }}</div>
                  <div class="text-600 text-sm">{{ project.client.user_type | titlecase }}</div>
                </div>
              </div>

              <p-divider></p-divider>

            </div>

            <!-- Freelancer Info (if assigned) -->
            <div class="card mb-4" *ngIf="project.selected_freelancer">
              <h3 class="text-lg font-semibold mb-3">Assigned Freelancer</h3>

              <div class="flex align-items-center gap-3 mb-3">
                <div class="flex align-items-center justify-content-center bg-green-100 text-green-800 border-round-lg"
                     style="width: 3rem; height: 3rem; font-size: 1.5rem;">
                  {{ project.selected_freelancer.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium">{{ project.selected_freelancer.username }}</div>
                  <div class="text-600 text-sm">{{ project.selected_freelancer.user_type | titlecase }}</div>
                </div>
              </div>
            </div>


          </div>
        </div>

        <!-- Back Navigation -->
        <div class="mt-4">
          <button pButton label="Back to Projects" icon="pi pi-arrow-left" class="p-button-outlined" routerLink="/projects"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-height-3 {
      line-height: 1.75;
    }
  `]
})
export class PublicProjectDetailComponent implements OnInit {
  project: PublicProject | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
     private router: Router
  ) {}

  ngOnInit() {

    this.project =  history.state.project;
    console.log(this.project)
  }
  //   this.route.params.subscribe(params => {
  //     const projectId = params[];
  //     if (projectId) {
  //       this.loadProject(projectId);
  //     }
  //   });
  // }


  // loadProject(id: number) {
  //   this.loading = true;
  //   this.publicService.getPublicProject(id).subscribe({
  //     next: (project) => {
  //       this.project = project;
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading project:', error);
  //       this.project = null;
  //       this.loading = false;
  //     }
  //   });
  // }

  getStatusSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warn';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  }
}
