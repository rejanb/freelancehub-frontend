import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { PublicService } from '../../../../service/public.service';
import { PublicJob } from '../../../model/public.models';
import { PublicNavComponent } from '../../../components/public-nav/public-nav.component';

@Component({
  selector: 'app-public-job-detail',
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
    <div class="public-job-detail-container">
      <!-- Loading -->
      <div *ngIf="loading" class="text-center p-6">
        <p-progressSpinner></p-progressSpinner>
        <p class="mt-3">Loading job details...</p>
      </div>

      <!-- Job Not Found -->
      <div *ngIf="!loading && !job" class="text-center p-6">
        <i class="pi pi-exclamation-triangle text-6xl text-400 mb-3"></i>
        <h3>Job Not Found</h3>
        <p class="text-600 mb-4">The job you're looking for doesn't exist or is no longer available.</p>
        <button pButton label="Browse All Jobs" routerLink="/jobs" class="p-button-outlined"></button>
      </div>

      <!-- Job Details -->
      <div *ngIf="!loading && job" class="container mx-auto px-4 py-6">
        <!-- Header -->
        <div class="card mb-4">
          <div class="flex justify-content-between align-items-start flex-wrap gap-3">
            <div class="flex-1">
              <div class="flex align-items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold m-0">{{ job.title }}</h1>
                <p-tag
                  *ngIf="job.is_featured"
                  value="Featured"
                  severity="warn"
                  icon="pi pi-star">
                </p-tag>
              </div>
              <div class="flex align-items-center gap-4 text-600">
                <span><i class="pi pi-user mr-2"></i>{{ job.client.username }}</span>
                <span><i class="pi pi-calendar mr-2"></i>Posted {{ job.created_at | date:'mediumDate' }}</span>
                <p-tag [value]="job.status" [severity]="getStatusSeverity(job.status)"></p-tag>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 mb-2">\${{ job.budget }}</div>
              <button pButton label="Apply Now" class="p-button-success" [disabled]="job.status !== 'open'"></button>
            </div>
          </div>
        </div>

        <div class="grid">
          <!-- Main Content -->
          <div class="col-12 lg:col-8">
            <!-- Description -->
            <div class="card mb-4">
              <h2 class="text-xl font-semibold mb-3">Job Description</h2>
              <div class="text-700 line-height-3" [innerHTML]="job.description"></div>
            </div>

            <!-- Skills Required -->
            <div class="card mb-4" *ngIf="job.skills_required?.length">
              <h2 class="text-xl font-semibold mb-3">Skills Required</h2>
              <div class="flex flex-wrap gap-2">
                <p-tag
                  *ngFor="let skill of job.skills_required"
                  [value]="skill"
                  severity="info">
                </p-tag>
              </div>
            </div>

            <!-- Category -->
            <div class="card mb-4" *ngIf="job.category">
              <h2 class="text-xl font-semibold mb-3">Category</h2>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-tag text-blue-500"></i>
                <span class="font-medium">{{ job.category.name }}</span>
                <span class="text-600" *ngIf="job.category.description">- {{ job.category.description }}</span>
              </div>
            </div>

            <!-- Call to Action -->
            <div class="card text-center" *ngIf="job.status === 'open'">
              <h3 class="text-xl mb-3">Interested in this job?</h3>
              <p class="text-600 mb-4">Sign up or log in to submit your proposal</p>
              <div class="flex gap-3 justify-content-center">
                <button pButton label="Sign Up" routerLink="/register" class="p-button-success"></button>
                <button pButton label="Log In" routerLink="/login" class="p-button-outlined"></button>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 lg:col-4">
            <!-- Job Details -->
            <div class="card mb-4">
              <h3 class="text-lg font-semibold mb-3">Job Details</h3>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Budget</span>
                <span class="text-green-600 font-bold">\${{ job.budget }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Deadline</span>
                <span>{{ job.deadline | date:'mediumDate' }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200" *ngIf="job.location">
                <span class="font-medium">Location</span>
                <span>{{ job.location }}</span>
              </div>

              <div class="flex justify-content-between align-items-center py-2 border-bottom-1 border-200">
                <span class="font-medium">Status</span>
                <p-tag [value]="job.status" [severity]="getStatusSeverity(job.status)"></p-tag>
              </div>

              <div class="flex justify-content-between align-items-center py-2">
                <span class="font-medium">Posted</span>
                <span>{{ job.created_at | date:'mediumDate' }}</span>
              </div>
            </div>

            <!-- Client Info -->
            <div class="card mb-4">
              <h3 class="text-lg font-semibold mb-3">About the Client</h3>

              <div class="flex align-items-center gap-3 mb-3">
                <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-800 border-round-lg"
                     style="width: 3rem; height: 3rem; font-size: 1.5rem;">
                  {{ job.client.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium">{{ job.client.username }}</div>
                  <div class="text-600 text-sm">{{ job.client.user_type | titlecase }}</div>
                </div>
              </div>

              <p-divider></p-divider>

              <div class="text-center">
                <p class="text-600 mb-3">Want to work with this client?</p>
                <button pButton label="View Profile" class="p-button-outlined w-full" [disabled]="true"></button>
              </div>
            </div>

            <!-- Related Jobs -->
            <div class="card">
              <h3 class="text-lg font-semibold mb-3">Similar Jobs</h3>
              <div class="text-600 text-center py-4">
                <i class="pi pi-search mb-2 text-2xl"></i>
                <p>Browse more jobs in this category</p>
                <button pButton label="Browse Jobs" routerLink="/jobs" class="p-button-outlined"></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Navigation -->
        <div class="mt-4">
          <button pButton label="Back to Jobs" icon="pi pi-arrow-left" class="p-button-outlined" routerLink="/jobs"></button>
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
export class PublicJobDetailComponent implements OnInit {
  job: PublicJob | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const jobId = params['id'];
      if (jobId) {
        this.loadJob(jobId);
      }
    });
  }

  loadJob(id: number) {
    this.loading = true;
    this.publicService.getPublicJob(id).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.job = null;
        this.loading = false;
      }
    });
  }

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
