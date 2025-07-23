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
import { PublicService, PublicProjectFilters } from '../../../../service/public.service';
import { PublicProject, PublicListResponse } from '../../../model/public.models';
import { PublicNavComponent } from '../../../components/public-nav/public-nav.component';

@Component({
  selector: 'app-public-projects',
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
    <div class="public-projects-container">
      <div class="hero-section bg-primary text-white p-6 mb-4">
        <div class="container mx-auto">
          <h1 class="text-4xl font-bold mb-2">Browse Projects</h1>
          <p class="text-xl">Find exciting project opportunities</p>
        </div>
      </div>

      <div class="container mx-auto px-4">
        <!-- Filters Section -->
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
                  placeholder="Search projects..."
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

        <!-- Loading -->
        <div *ngIf="loading" class="text-center p-6">
          <p-progressSpinner></p-progressSpinner>
          <p class="mt-3">Loading projects...</p>
        </div>

        <!-- Projects Grid -->
        <div *ngIf="!loading" class="grid">
          <div class="col-12 md:col-6 lg:col-4" *ngFor="let project of projects">
            <div class="project-card card h-full">
              <div class="card-content">
                <div class="flex justify-content-between align-items-start mb-3">
                  <h3 class="text-xl font-bold m-0 text-900">{{ project.title }}</h3>
                  <div class="flex gap-2">
                    <p-tag
                      *ngIf="project.is_featured"
                      value="Featured"
                      severity="warn"
                      icon="pi pi-star">
                    </p-tag>
                    <p-tag
                      [value]="project.status"
                      [severity]="getStatusSeverity(project.status)">
                    </p-tag>
                  </div>
                </div>

                <p class="text-600 mb-3 line-clamp-3">{{ project.description }}</p>

                <div class="project-details mb-3">
                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-dollar text-green-500 mr-2"></i>
                    <span class="font-semibold text-lg text-900">\${{ project.budget }}</span>
                  </div>

                  <div class="flex align-items-center mb-2" *ngIf="project.location">
                    <i class="pi pi-map-marker text-blue-500 mr-2"></i>
                    <span class="text-700">{{ project.location }}</span>
                  </div>

                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-calendar text-orange-500 mr-2"></i>
                    <span class="text-700">{{ project.deadline | date:'mediumDate' }}</span>
                  </div>

                  <div class="flex align-items-center mb-2">
                    <i class="pi pi-user text-purple-500 mr-2"></i>
                    <span class="text-700">{{ project.client.username }}</span>
                  </div>

                  <div class="flex align-items-center mb-2" *ngIf="project.selected_freelancer">
                    <i class="pi pi-users text-green-500 mr-2"></i>
                    <span class="text-700">Assigned to {{ project.selected_freelancer.username }}</span>
                  </div>

                  <div class="flex align-items-center mb-2" *ngIf="project.category">
                    <i class="pi pi-tag text-blue-500 mr-2"></i>
                    <span class="text-700">{{ project.category.name }}</span>
                  </div>
                </div>

                <div class="skills-section mb-3" *ngIf="project.skills_required?.length">
                  <p-tag
                    *ngFor="let skill of project.skills_required.slice(0, 3)"
                    [value]="skill"
                    severity="info"
                    class="mr-1 mb-1">
                  </p-tag>
                  <span *ngIf="project.skills_required.length > 3" class="text-500">
                    +{{ project.skills_required.length - 3 }} more
                  </span>
                </div>

                <div class="mt-auto">
                  <button
                    pButton
                    label="View Details"
                    icon="pi pi-arrow-right"
                    class="w-full p-button-outlined"
                    [routerLink]="['/projects', project.id]">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div *ngIf="!loading && projects.length === 0" class="text-center p-6">
          <i class="pi pi-search text-6xl text-400 mb-3"></i>
          <h3>No projects found</h3>
          <p class="text-600">Try adjusting your filters to see more results.</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && totalRecords > 0" class="flex justify-content-center mt-4">
          <button
            pButton
            label="Load More"
            class="p-button-outlined"
            [disabled]="!hasMore"
            (click)="loadMore()">
          </button>
        </div>

        <!-- Stats -->
        <div class="text-center mt-4 text-500">
          Showing {{ projects.length }} of {{ totalRecords }} projects
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-card {
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

    .project-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .card-content {
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .project-details {
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

    /* Enhanced button styling */
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

    /* Enhanced card spacing */
    .grid > .col-12 {
      padding: 0.75rem;
    }
  `]
})
export class PublicProjectsComponent implements OnInit {
  projects: PublicProject[] = [];
  categories: any[] = [];
  loading = false;
  totalRecords = 0;
  hasMore = false;

  filters: PublicProjectFilters = {
    page: 1,
    page_size: 12
  };

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Budget: High to Low', value: '-budget' },
    { label: 'Budget: Low to High', value: 'budget' },
    { label: 'Deadline: Soonest', value: 'deadline' }
  ];

  private searchTimeout: any;

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProjects();
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

  loadProjects(reset = true) {
    if (reset) {
      this.filters.page = 1;
      this.projects = [];
    }

    this.loading = true;

    this.publicService.getPublicProjects(this.filters).subscribe({
      next: (response: PublicListResponse<PublicProject>) => {
        if (reset) {
          this.projects = response.results;
        } else {
          this.projects = [...this.projects, ...response.results];
        }
        this.totalRecords = response.count;
        this.hasMore = !!response.next;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.loadProjects();
    }, 500);
  }

  onFilterChange() {
    this.loadProjects();
  }

  clearFilters() {
    this.filters = {
      page: 1,
      page_size: 12
    };
    this.loadProjects();
  }

  loadMore() {
    if (this.hasMore && !this.loading) {
      this.filters.page = (this.filters.page || 1) + 1;
      this.loadProjects(false);
    }
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
