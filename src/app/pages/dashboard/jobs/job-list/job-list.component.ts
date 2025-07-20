import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobService, JobFilters } from '../../../../../service/job.service';
import { TokenService } from '../../../../utils/token.service';
import { Job } from '../../../../model/models';
import { RoleConst } from '../../../../const/api-const';

interface JobListFilters {
  search: string;
  status: boolean | null;
  dateRange: Date[] | null;
  sort: string | null;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    TagModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2>Jobs</h2>
        <button 
          *ngIf="isClient"
          pButton 
          label="Post New Job" 
          icon="pi pi-plus" 
          routerLink="create"
          class="p-button-success">
        </button>
      </div>

      <!-- Filters -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
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
        
        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="statusOptions"
            [(ngModel)]="filters.status"
            (onChange)="loadJobs()"
            placeholder="Status"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>

        <div class="col-12 md:col-3">
          <p-calendar
            [(ngModel)]="filters.dateRange"
            selectionMode="range"
            [showButtonBar]="true"
            (onSelect)="onDateSelect()"
            placeholder="Date range"
            class="w-full">
          </p-calendar>
        </div>

        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="sortOptions"
            [(ngModel)]="filters.sort"
            (onChange)="loadJobs()"
            placeholder="Sort by"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>
      </div>

      <!-- Jobs Table -->
      <p-table
        [value]="jobs"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [totalRecords]="totalRecords"
        [rowsPerPageOptions]="[10, 25, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} jobs"
        (onPage)="onPageChange($event)">
        
        <ng-template pTemplate="header">
          <tr>
            <th>Title</th>
            <th>Budget</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Proposals</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-job>
          <tr>
            <td>
              <a [routerLink]="[job.id]" class="text-primary hover:underline">
                {{ job.title }}
              </a>
            </td>
            <td>{{ job.budget | currency }}</td>
            <td>{{ job.deadline | date }}</td>
            <td>
              <p-tag 
                [value]="job.is_open ? 'Open' : 'Closed'"
                [severity]="job.is_open ? 'success' : 'danger'">
              </p-tag>
            </td>
            <td>
              <a 
                *ngIf="isClient"
                [routerLink]="[job.id, 'proposals']" 
                class="text-primary hover:underline">
                View Proposals
              </a>
              <span *ngIf="!isClient">{{ job.proposal_count || 0 }}</span>
            </td>
            <td>
              <div class="flex gap-2">
                <button 
                  *ngIf="isClient && job.is_open"
                  pButton 
                  icon="pi pi-pencil" 
                  class="p-button-rounded p-button-text"
                  [routerLink]="['edit', job.id]"
                  pTooltip="Edit Job">
                </button>
                <button 
                  *ngIf="isClient && job.is_open"
                  pButton 
                  icon="pi pi-times" 
                  class="p-button-rounded p-button-text p-button-danger"
                  (click)="confirmClose(job)"
                  pTooltip="Close Job">
                </button>
                <button 
                  *ngIf="isClient && !job.is_open"
                  pButton 
                  icon="pi pi-refresh" 
                  class="p-button-rounded p-button-text p-button-success"
                  (click)="reopenJob(job)"
                  pTooltip="Reopen Job">
                </button>
                <button 
                  *ngIf="!isClient && job.is_open"
                  pButton 
                  icon="pi pi-send" 
                  class="p-button-rounded p-button-text p-button-success"
                  [routerLink]="[job.id]"
                  pTooltip="Submit Proposal">
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center p-4">
              No jobs found.
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Confirmation Dialog -->
      <p-confirmDialog 
        header="Close Job" 
        icon="pi pi-exclamation-triangle"
        acceptButtonStyleClass="p-button-danger"
        rejectButtonStyleClass="p-button-text">
      </p-confirmDialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-dropdown {
        width: 100%;
      }
      .p-calendar {
        width: 100%;
      }
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  totalRecords = 0;
  isClient = false;

  filters: JobListFilters = {
    search: '',
    status: null,
    dateRange: null,
    sort: null,
    page: 1,
    pageSize: 10
  };

  statusOptions = [
    { label: 'Open', value: true },
    { label: 'Closed', value: false }
  ];

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Budget: High to Low', value: '-budget' },
    { label: 'Budget: Low to High', value: 'budget' },
    { label: 'Deadline: Soonest', value: 'deadline' },
    { label: 'Deadline: Latest', value: '-deadline' }
  ];

  constructor(
    private jobService: JobService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    
    const filters: JobFilters = {
      search: this.filters.search,
      is_open: this.filters.status,
      page: this.filters.page,
      page_size: this.filters.pageSize,
      ordering: this.filters.sort
    };

    if (this.filters.dateRange && this.filters.dateRange.length === 2) {
      const [start, end] = this.filters.dateRange;
      if (start) filters.created_after = start.toISOString();
      if (end) filters.created_before = end.toISOString();
    }

    this.jobService.getJobs(filters).subscribe({
      next: (response) => {
        this.jobs = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load jobs. Please try again.'
        });
        this.loading = false;
      }
    });
  }

  onSearch() {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadJobs();
    }, 300);
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.pageSize = event.rows;
    this.loadJobs();
  }

  onDateSelect() {
    this.filters.page = 1;
    this.loadJobs();
  }

  confirmClose(job: Job) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to close this job? This will prevent new proposals.',
      accept: () => {
        this.closeJob(job);
      }
    });
  }

  closeJob(job: Job) {
    this.jobService.closeJob(job.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Job closed successfully'
        });
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error closing job:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to close job. Please try again.'
        });
      }
    });
  }

  reopenJob(job: Job) {
    this.jobService.reopenJob(job.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Job reopened successfully'
        });
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error reopening job:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to reopen job. Please try again.'
        });
      }
    });
  }

  private searchTimeout: any;
} 