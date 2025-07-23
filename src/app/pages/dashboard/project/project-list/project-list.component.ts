import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService, ProjectFilters } from '../../../../../service/project.service';
import { TokenService } from '../../../../../app/utils/token.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    PaginatorModule,
    CardModule,
    DialogModule
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="project-list-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold m-0">
          <ng-container [ngSwitch]="currentView">
            <span *ngSwitchCase="'my'">My Projects</span>
            <span *ngSwitchCase="'available'">Available Projects</span>
            <span *ngSwitchCase="'applications'">My Applications</span>
            <span *ngSwitchCase="'saved'">Saved Projects</span>
            <span *ngSwitchDefault>All Projects</span>
          </ng-container>
        </h2>
        
        <div class="flex gap-2">
          <!-- View Toggle Buttons -->
          <div class="flex gap-2" *ngIf="userRole === 'freelancer'">
            <button pButton 
                    label="Available Projects" 
                    [class]="currentView === 'available' ? 'p-button-sm' : 'p-button-outlined p-button-sm'"
                    (click)="switchView('available')">
            </button>
            <button pButton 
                    label="My Applications" 
                    [class]="currentView === 'applications' ? 'p-button-sm' : 'p-button-outlined p-button-sm'"
                    (click)="switchView('applications')">
            </button>
            <button pButton 
                    label="Saved Projects" 
                    [class]="currentView === 'saved' ? 'p-button-sm' : 'p-button-outlined p-button-sm'"
                    (click)="switchView('saved')">
            </button>
          </div>
          
          <div class="flex gap-2" *ngIf="userRole === 'client'">
            <button pButton 
                    label="My Projects" 
                    [class]="currentView === 'my' ? 'p-button-sm' : 'p-button-outlined p-button-sm'"
                    (click)="switchView('my')">
            </button>
          </div>

          <div class="flex gap-2" *ngIf="userRole === 'admin'">
            <button pButton 
                    label="All Projects" 
                    [class]="currentView === 'all' ? 'p-button-sm' : 'p-button-outlined p-button-sm'"
                    (click)="switchView('all')">
            </button>
          </div>

          <!-- Create Project Button (Client and Admin only) -->
          <button pButton 
                  label="New Project" 
                  icon="pi pi-plus" 
                  class="p-button-success p-button-sm"
                  *ngIf="userRole === 'client' || userRole === 'admin'"
                  routerLink="./form">
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="grid">
          <div class="col-12 md:col-4">
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search"></i>
              <input pInputText 
                     [(ngModel)]="filters.search" 
                     placeholder="Search projects..."
                     class="w-full"
                     (input)="onFilterChange()">
            </span>
          </div>
          
          <div class="col-12 md:col-3">
            <p-dropdown [(ngModel)]="filters.status" 
                        [options]="statusOptions || []" 
                        placeholder="Filter by Status"
                        optionLabel="label"
                        optionValue="value"
                        [showClear]="true"
                        class="w-full"
                        (onChange)="onFilterChange()">
            </p-dropdown>
          </div>
          
          <div class="col-12 md:col-3">
            <p-dropdown [(ngModel)]="filters.category" 
                        [options]="categories || []" 
                        placeholder="Filter by Category"
                        optionLabel="name"
                        optionValue="id"
                        [showClear]="true"
                        class="w-full"
                        (onChange)="onFilterChange()">
            </p-dropdown>
          </div>
          
          <div class="col-12 md:col-2">
            <button pButton 
                    label="Clear" 
                    icon="pi pi-filter-slash" 
                    class="p-button-outlined w-full"
                    (click)="clearFilters()">
            </button>
          </div>
        </div>
      </div>

      <!-- Projects Table/Cards -->
      <div class="card">
        <p-table [value]="projects" 
                 [lazy]="true" 
                 [paginator]="true" 
                 [rows]="pageSize"
                 [totalRecords]="totalRecords"
                 [loading]="loading"
                 (onLazyLoad)="loadProjects($event)"
                 [showCurrentPageReport]="true"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} projects"
                 [rowsPerPageOptions]="[10, 25, 50]"
                 responsiveLayout="scroll">
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">Title <p-sortIcon field="title"></p-sortIcon></th>
              <th pSortableColumn="budget">Budget <p-sortIcon field="budget"></p-sortIcon></th>
              <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
              <th>Client</th>
              <th *ngIf="currentView !== 'applications'">Proposals</th>
              <th *ngIf="currentView === 'applications'">Application Status</th>
              <th pSortableColumn="created_at">Posted <p-sortIcon field="created_at"></p-sortIcon></th>
              <th>Actions</th>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="body" let-project>
            <tr>
              <td>
                <div class="font-medium">{{ project.title }}</div>
                <div class="text-600 text-sm" *ngIf="project.category">{{ project.category.name }}</div>
              </td>
              
              <td>
                <span class="font-bold text-green-600">\${{ project.budget | number:'1.0-0' }}</span>
              </td>
              
              <td>
                <p-tag [value]="project.status" [severity]="getStatusSeverity(project.status)"></p-tag>
              </td>
              
              <td>
                <div class="flex align-items-center gap-2">
                  <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-800 border-round"
                       style="width: 2rem; height: 2rem; font-size: 0.875rem;">
                    {{ project.client.username.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ project.client.username }}</span>
                </div>
              </td>
              
              <td *ngIf="currentView !== 'applications'">
                <span class="font-medium">{{ project.proposal_count || 0 }}</span>
                <span class="text-600 ml-1">proposals</span>
              </td>
              
              <td *ngIf="currentView === 'applications'">
                <p-tag [value]="project.application_status" 
                       [severity]="getApplicationStatusSeverity(project.application_status)">
                </p-tag>
              </td>
              
              <td>
                {{ project.created_at | date:'mediumDate' }}
              </td>
              
              <td>
                <div class="flex gap-1">
                  <!-- View Details -->
                  <button pButton 
                          icon="pi pi-eye" 
                          class="p-button-rounded p-button-outlined p-button-sm"
                          [routerLink]="['./', project.id]"
                          pTooltip="View Details">
                  </button>
                  
                  <!-- Apply (Freelancer only, for available projects) -->
                  <button pButton 
                          icon="pi pi-send" 
                          class="p-button-rounded p-button-success p-button-sm"
                          *ngIf="userRole === 'freelancer' && currentView === 'available' && project.status === 'open'"
                          (click)="showApplyDialog(project)"
                          pTooltip="Apply for Project">
                  </button>
                  
                  <!-- Withdraw Application (Freelancer only) -->
                  <button pButton 
                          icon="pi pi-times" 
                          class="p-button-rounded p-button-danger p-button-sm"
                          *ngIf="userRole === 'freelancer' && currentView === 'applications' && project.application_status === 'pending'"
                          (click)="withdrawApplication(project)"
                          pTooltip="Withdraw Application">
                  </button>
                  
                  <!-- View Proposals (Client/Admin only) -->
                  <button pButton 
                          icon="pi pi-users" 
                          class="p-button-rounded p-button-info p-button-sm"
                          *ngIf="(userRole === 'client' || userRole === 'admin') && project.proposal_count > 0"
                          (click)="viewProposals(project)"
                          pTooltip="View Proposals">
                  </button>
                  
                  <!-- Edit (Client/Admin only, for own projects) -->
                  <button pButton 
                          icon="pi pi-pencil" 
                          class="p-button-rounded p-button-outlined p-button-sm"
                          *ngIf="canEditProject(project)"
                          [routerLink]="['./form', project.id]"
                          pTooltip="Edit Project">
                  </button>
                  
                  <!-- Delete (Client/Admin only, for own projects) -->
                  <button pButton 
                          icon="pi pi-trash" 
                          class="p-button-rounded p-button-danger p-button-sm"
                          *ngIf="canDeleteProject(project)"
                          (click)="deleteProject(project)"
                          pTooltip="Delete Project">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
          
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="8" class="text-center py-6">
                <div class="text-600">
                  <i class="pi pi-folder-open text-4xl mb-3"></i>
                  <p class="text-lg">No projects found</p>
                  <p class="text-sm">
                    <ng-container [ngSwitch]="currentView">
                      <span *ngSwitchCase="'available'">No available projects at the moment.</span>
                      <span *ngSwitchCase="'applications'">You haven't applied to any projects yet.</span>
                      <span *ngSwitchCase="'my'">You haven't created any projects yet.</span>
                      <span *ngSwitchDefault>No projects available.</span>
                    </ng-container>
                  </p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Apply Dialog -->
      <p-dialog header="Apply for Project" 
                [(visible)]="showApplyDialogFlag" 
                [modal]="true" 
                [style]="{ width: '500px' }"
                [draggable]="false" 
                [resizable]="false">
        <form *ngIf="selectedProject" (ngSubmit)="submitApplication()">
          <div class="mb-3">
            <h4 class="mt-0">{{ selectedProject.title }}</h4>
            <p class="text-600">Budget: <span class="font-bold">\${{ selectedProject.budget }}</span></p>
          </div>
          
          <div class="mb-3">
            <label for="coverLetter" class="block text-900 font-medium mb-2">Cover Letter *</label>
            <textarea id="coverLetter" 
                      [(ngModel)]="applicationData.cover_letter" 
                      name="coverLetter"
                      rows="6" 
                      class="w-full"
                      placeholder="Explain why you're the perfect fit for this project..."
                      required>
            </textarea>
          </div>
          
          <div class="mb-3">
            <label for="proposedBudget" class="block text-900 font-medium mb-2">Proposed Budget *</label>
            <input type="number" 
                   id="proposedBudget" 
                   [(ngModel)]="applicationData.proposed_budget" 
                   name="proposedBudget"
                   class="w-full" 
                   placeholder="Enter your budget proposal"
                   [min]="1"
                   required>
          </div>
          
          <div class="mb-3">
            <label for="timeline" class="block text-900 font-medium mb-2">Estimated Timeline</label>
            <input type="text" 
                   id="timeline" 
                   [(ngModel)]="applicationData.estimated_timeline" 
                   name="timeline"
                   class="w-full" 
                   placeholder="e.g., 2 weeks, 1 month">
          </div>
          
          <div class="flex gap-2 justify-content-end">
            <button pButton 
                    label="Cancel" 
                    type="button"
                    class="p-button-outlined" 
                    (click)="closeApplyDialog()">
            </button>
            <button pButton 
                    label="Submit Application" 
                    type="submit"
                    [disabled]="!applicationData.cover_letter || !applicationData.proposed_budget"
                    [loading]="submittingApplication">
            </button>
          </div>
        </form>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-table .p-table-tbody > tr > td {
      padding: 1rem 0.75rem;
      vertical-align: top;
    }
    
    :host ::ng-deep .p-paginator {
      border: none;
      padding-left: 0;
      padding-right: 0;
    }
  `]
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  
  currentView: 'all' | 'my' | 'available' | 'applications' | 'saved' = 'all';
  userRole: string = '';
  
  filters: ProjectFilters = {
    page: 1,
    pageSize: 10
  };
  
  statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  
  categories: any[] = []; // Ensure it's always an array
  
  // Application dialog
  showApplyDialogFlag = false;
  selectedProject: any = null;
  submittingApplication = false;
  applicationData = {
    cover_letter: '',
    proposed_budget: null,
    estimated_timeline: ''
  };

  constructor(
    private projectService: ProjectService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    // Initialize arrays to prevent findIndex errors
    this.categories = [];
    this.projects = [];
  }

  ngOnInit() {
    // Ensure arrays are initialized before any operations
    this.categories = [];
    this.projects = [];
    
    this.userRole = this.tokenService.getUserRole();
    
    // Check route data for viewType first
    const routeViewType = this.route.snapshot.data['viewType'];
    if (routeViewType) {
      this.currentView = routeViewType;
    } else {
      this.setInitialView();
    }
    
    this.loadCategories();
    this.loadProjects({ first: 0, rows: this.pageSize });
  }

  setInitialView() {
    switch (this.userRole) {
      case 'freelancer':
        this.currentView = 'available';
        break;
      case 'client':
        this.currentView = 'my';
        break;
      case 'admin':
        this.currentView = 'all';
        break;
      default:
        this.currentView = 'all';
    }
  }

  switchView(view: 'all' | 'my' | 'available' | 'applications' | 'saved') {
    this.currentView = view;
    this.clearFilters();
    this.loadProjects({ first: 0, rows: this.pageSize });
  }

  loadCategories() {
    this.projectService.getCategories().subscribe({
      next: (categories) => {
        // Ensure categories is always an array
        this.categories = Array.isArray(categories) ? categories : [];
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Set to empty array on error to prevent dropdown issues
        this.categories = [];
      }
    });
  }

  loadProjects(event: any) {
    this.loading = true;
    this.filters.page = Math.floor(event.first / event.rows) + 1;
    this.filters.pageSize = event.rows;

    let serviceCall;
    
    switch (this.currentView) {
      case 'my':
        serviceCall = this.projectService.getMyProjects();
        break;
      case 'available':
        serviceCall = this.projectService.getAvailableProjects();
        break;
      case 'applications':
        serviceCall = this.projectService.getMyApplications();
        break;
      case 'saved':
        serviceCall = this.projectService.getSavedProjects();
        break;
      default:
        serviceCall = this.projectService.getProjects(this.filters);
    }

    serviceCall.subscribe({
      next: (response: any) => {
        if (response.results) {
          this.projects = response.results;
          this.totalRecords = response.count;
        } else {
          this.projects = response;
          this.totalRecords = response.length;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects'
        });
        this.loading = false;
      }
    });
  }

  onFilterChange() {
    this.loadProjects({ first: 0, rows: this.pageSize });
  }

  clearFilters() {
    this.filters = {
      page: 1,
      pageSize: this.pageSize
    };
    this.onFilterChange();
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

  getApplicationStatusSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'pending': return 'warn';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'withdrawn': return 'secondary';
      default: return 'info';
    }
  }

  canEditProject(project: any): boolean {
    if (this.userRole === 'admin') return true;
    if (this.userRole === 'client' && project.client.id === this.tokenService.getUserId()) return true;
    return false;
  }

  canDeleteProject(project: any): boolean {
    if (this.userRole === 'admin') return true;
    if (this.userRole === 'client' && project.client.id === this.tokenService.getUserId() && project.status === 'open') return true;
    return false;
  }

  showApplyDialog(project: any) {
    this.selectedProject = project;
    this.applicationData = {
      cover_letter: '',
      proposed_budget: null,
      estimated_timeline: ''
    };
    this.showApplyDialogFlag = true;
  }

  closeApplyDialog() {
    this.showApplyDialogFlag = false;
    this.selectedProject = null;
  }

  submitApplication() {
    if (!this.selectedProject || !this.applicationData.cover_letter || !this.applicationData.proposed_budget) {
      return;
    }

    this.submittingApplication = true;
    
    this.projectService.applyForProject(this.selectedProject.id, this.applicationData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Application submitted successfully!'
        });
        this.closeApplyDialog();
        this.loadProjects({ first: 0, rows: this.pageSize });
        this.submittingApplication = false;
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || 'Failed to submit application'
        });
        this.submittingApplication = false;
      }
    });
  }

  withdrawApplication(project: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to withdraw your application?',
      header: 'Confirm Withdrawal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Assuming the project object has proposal_id when in applications view
        this.projectService.withdrawProposal(project.proposal_id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Application withdrawn successfully'
            });
            this.loadProjects({ first: 0, rows: this.pageSize });
          },
          error: (error) => {
            console.error('Error withdrawing application:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to withdraw application'
            });
          }
        });
      }
    });
  }

  viewProposals(project: any) {
    // Navigate to proposals view - implement this route
    // this.router.navigate(['/dashboard/projects', project.id, 'proposals']);
    console.log('View proposals for project:', project.id);
  }

  deleteProject(project: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Project deleted successfully'
            });
            this.loadProjects({ first: 0, rows: this.pageSize });
          },
          error: (error) => {
            console.error('Error deleting project:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete project'
            });
          }
        });
      }
    });
  }
}
