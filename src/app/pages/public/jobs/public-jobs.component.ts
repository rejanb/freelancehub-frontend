import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PublicService, PublicJobFilters } from '../../../../service/public.service';
import { PublicJob, PublicListResponse } from '../../../model/public.models';
import { PublicNavComponent } from '../../../components/public-nav/public-nav.component';

@Component({
  selector: 'app-public-jobs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    PublicNavComponent
  ],
  template: `
    <app-public-nav></app-public-nav>
    <div class="public-jobs-container">
      <div class="hero-section bg-primary text-white p-6 mb-4">
        <div class="container mx-auto">
          <h1 class="text-4xl font-bold mb-2">Browse Jobs</h1>
          <p class="text-xl">Discover amazing opportunities from top clients</p>
        </div>
      </div>

      <div class="container mx-auto px-4">
        <div class="card mb-4">
          <div class="grid">
            <div class="col-12 md:col-4">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="filters.search"
                  (input)="onSearch()"
                  placeholder="Search jobs..."
                  class="w-full">
              </span>
            </div>

            <div class="col-12 md:col-2">
              <p-dropdown
                [options]="categories"
                [(ngModel)]="filters.category"
                (onChange)="onFilterChange()"
                placeholder="Category"
                optionLabel="name"
                optionValue="id"
                [showClear]="true"
                class="w-full">
              </p-dropdown>
            </div>

            <div class="col-12 md:col-2">
              <input
                type="number"
                pInputText
                [(ngModel)]="filters.budget_min"
                (input)="onFilterChange()"
                placeholder="Min Budget"
                class="w-full">
            </div>

            <div class="col-12 md:col-2">
              <input
                type="number"
                pInputText
                [(ngModel)]="filters.budget_max"
                (input)="onFilterChange()"
                placeholder="Max Budget"
                class="w-full">
            </div>

            <div class="col-12 md:col-2">
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="filters.ordering"
                (onChange)="onFilterChange()"
                placeholder="Sort by"
                [showClear]="true"
                class="w-full">
              </p-dropdown>
            </div>
          </div>

          <div class="grid mt-3">
            <div class="col-12 md:col-4">
              <input
                type="text"
                pInputText
                [(ngModel)]="filters.location"
                (input)="onFilterChange()"
                placeholder="Location"
                class="w-full">
            </div>

            <div class="col-12 md:col-4">
              <input
                type="text"
                pInputText
                [(ngModel)]="filters.skills"
                (input)="onFilterChange()"
                placeholder="Skills (comma separated)"
                class="w-full">
            </div>

            <div class="col-12 md:col-4">
              <button
                pButton
                label="Clear Filters"
                class="p-button-outlined w-full"
                (click)="clearFilters()">
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="loading" class="text-center p-6">
          <p-progressSpinner></p-progressSpinner>
          <p class="mt-3">Loading jobs...</p>
        </div>

        <div *ngIf="!loading" class="grid">
          <div class="col-12 md:col-6 lg:col-4" *ngFor="let job of jobs">
            <div class="job-card card h-full">
              <div class="card-content">
                <div class="flex justify-content-between align-items-start mb-3">
                  <h3 class="text-xl font-bold m-0 text-900">{{ job.title }}</h3>
                  <p-tag 
                    *ngIf="job.is_featured" 
                    value="Featured" 
                    severity="warn" 
                    icon="pi pi-star">
                  </p-tag>
                </div>

                <p class="text-600 mb-3 line-clamp-3">{{ job.description }}</p>

                <div class="job-details mb-3">
                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-dollar text-green-500 mr-2"></i>
                    <span class="font-semibold text-lg text-900">\${{ job.budget }}</span>
                  </div>

                  <div class="flex align-items-center mb-2" *ngIf="job.location">
                    <i class="pi pi-map-marker text-blue-500 mr-2"></i>
                    <span class="text-700">{{ job.location }}</span>
                  </div>

                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-calendar text-orange-500 mr-2"></i>
                    <span class="text-700">{{ job.deadline | date:'mediumDate' }}</span>
                  </div>

                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-user text-purple-500 mr-2"></i>
                    <span class="text-700">{{ job.client.username }}</span>
                  </div>
                </div>

                <div class="skills-section mb-3" *ngIf="job.skills_required?.length">
                  <p-tag 
                    *ngFor="let skill of job.skills_required.slice(0, 3)"
                    [value]="skill"
                    severity="info"
                    class="mr-1 mb-1">
                  </p-tag>
                  <span *ngIf="job.skills_required.length > 3" class="text-500">
                    +{{ job.skills_required.length - 3 }} more
                  </span>
                </div>

                <div class="mt-auto">
                  <button
                    pButton
                    label="View Details"
                    icon="pi pi-arrow-right"
                    class="w-full p-button-outlined"
                    [routerLink]="['/jobs', job.id]">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && jobs.length === 0" class="text-center p-6">
          <i class="pi pi-search text-6xl text-400 mb-3"></i>
          <h3>No jobs found</h3>
          <p class="text-600">Try adjusting your filters to see more results.</p>
        </div>

        <div *ngIf="!loading && totalRecords > 0" class="flex justify-content-center mt-4">
          <button
            pButton
            label="Load More"
            class="p-button-outlined"
            [disabled]="!hasMore"
            (click)="loadMore()">
          </button>
        </div>

        <div class="text-center mt-4 text-500">
          Showing {{ jobs.length }} of {{ totalRecords }} jobs
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      border: none;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      margin-bottom: 1.5rem;
    }

    .job-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .card-content {
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .job-details {
      background: rgba(var(--primary-color-rgb), 0.02);
      border-radius: 12px;
      padding: 1rem;
      border-left: 4px solid var(--primary-color);
    }

    .skills-section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 0.75rem;
    }

    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.6;
    }

    .hero-section {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
    }

    :host ::ng-deep .p-button-outlined {
      border: 2px solid var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .p-button-outlined:hover {
      background: var(--primary-color);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.4);
    }

    .grid > .col-12 {
      padding: 0.75rem;
    }
  `]
})
export class PublicJobsComponent implements OnInit {
  jobs: PublicJob[] = [];
  categories: any[] = [];
  loading = false;
  totalRecords = 0;
  hasMore = false;

  filters: PublicJobFilters = {
    page: 1,
    page_size: 12
  };

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Budget: High to Low', value: '-budget' },
    { label: 'Budget: Low to High', value: 'budget' },
    { label: 'Deadline', value: 'deadline' }
  ];

  searchTimeout: any;

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadJobs();
  }

  loadCategories() {
    this.publicService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.results || response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadJobs(reset = true) {
    if (reset) {
      this.filters.page = 1;
      this.jobs = [];
    }

    this.loading = true;

    this.publicService.getPublicJobs(this.filters).subscribe({
      next: (response: PublicListResponse<PublicJob>) => {
        if (reset) {
          this.jobs = response.results;
        } else {
          this.jobs = [...this.jobs, ...response.results];
        }
        this.totalRecords = response.count;
        this.hasMore = !!response.next;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadJobs();
    }, 500);
  }

  onFilterChange() {
    this.loadJobs();
  }

  clearFilters() {
    this.filters = {
      page: 1,
      page_size: 12
    };
    this.loadJobs();
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.filters.page = (this.filters.page || 1) + 1;
      this.loadJobs(false);
    }
  }
}