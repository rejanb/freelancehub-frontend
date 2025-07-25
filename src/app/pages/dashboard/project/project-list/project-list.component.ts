import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription, combineLatest } from 'rxjs';
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";

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
    DialogModule,
    IconField,
    InputIcon
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
            <span *ngSwitchCase="'proposals'">Received Proposals</span>
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

          <div class="col-12 md:col-4">
            <p-iconfield styleClass="w-full" iconPosition="left">
              <p-inputicon>
                <i class="pi pi-search"></i>
              </p-inputicon>
              <input
                  pInputText
                  [(ngModel)]="filters.search"
                  type="text"
                  (input)="onFilterChange()"
                  placeholder="Search"
                  class="w-full"
              />
            </p-iconfield>
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
      <div  class="card">
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
              <th pSortableColumn="created_at">Posted <p-sortIcon field="created_at"></p-sortIcon></th>
              <th>Actions</th>
            </tr>
          </ng-template>


          <ng-template pTemplate="body" let-project>
            <tr>
              <td>
                <div class="font-medium">{{ getProjectTitle(project) }}</div>
                <div class="text-600 text-sm" *ngIf="getProjectCategory(project)">{{ getProjectCategory(project) }}</div>
              </td>

              <td>
                <span class="font-bold text-green-600">\${{ getProjectBudget(project) | number:'1.0-0' }}</span>
              </td>

              <td  *ngIf="currentView !== 'applications'">
                <p-tag [value]="getProjectStatus(project)" [severity]="getStatusSeverity(getProjectStatus(project))"></p-tag>
              </td>
              <td  *ngIf="currentView == 'applications'">
                <p-tag [value]="getProjectStatus(project)" [severity]="getApplicationStatusSeverity(getProjectStatus(project))"></p-tag>
              </td>

              <td>
                <div class="flex align-items-center gap-2">
                  <span>{{ getProjectClientName(project) }}</span>
                </div>
              </td>

              <td *ngIf="currentView !== 'applications'">
                <span class="font-medium">{{ getProjectProposalsCount(project) }}</span>
                <span class="text-600 ml-1">proposals</span>
              </td>

              <td>
                {{ getProjectCreatedDate(project) | date:'mediumDate' }}
              </td>

              <td>
                <div class="flex gap-1">
                  <!-- View Details -->
                  <button pButton
                          icon="pi pi-eye"
                          class="p-button-rounded p-button-outlined p-button-sm"
                          [routerLink]="['/dashboard/projects/', getProjectId(project)]"
                          pTooltip="View Details">
                  </button>

                  <!-- Apply (Freelancer only, for available projects) -->
                  <button pButton
                          icon="pi pi-send"
                          class="p-button-rounded p-button-info p-button-sm"
                          [routerLink]="['/dashboard/projects', getProjectId(project), 'proposals']"
                          pTooltip="View Proposals">
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
                          *ngIf="(userRole === 'client' || userRole === 'admin') && project.proposals_count > 0"
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
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: any[] = [];
  totalRecords = 0;
  pageSize = 10;
  loading = false;
  view:any = '';
  private routeSubscription: Subscription = new Subscription();

  currentView: 'all' | 'my' | 'available' | 'applications' | 'saved' | 'proposals' = 'all';
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

    if (this.userRole)
    // Subscribe to both route data and query params changes
    this.routeSubscription = combineLatest([
      this.route.data,
      this.route.queryParams
    ]).subscribe(([data, params]) => {
      console.log('Route data:', data);
      console.log('Query params:', params);

      let targetView: string | null = null;

      // Check route data first (for routes like /projects/available)
      if (data['viewType']) {
        targetView = data['viewType'];
      }
      // Then check query params (for routes like /projects?view=my)
      else if (params['view']) {
        targetView = params['view'];
      }
      // Handle filter param as well (for routes like /projects?filter=proposals)
      else if (params['filter']) {
        targetView = params['filter'];
      }

      if (targetView) {
        this.currentView = targetView as 'all' | 'my' | 'available' | 'applications' | 'saved' | 'proposals';
        this.view = targetView;
      } else {
        this.setInitialView();
      }

      this.loadCategories();
      this.switchView(this.currentView);
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
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

  switchView(view: 'all' | 'my' | 'available' | 'applications' | 'saved' | 'proposals') {
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
        console.log('Error loading categories:', error);
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
    console.log(this.currentView)
    switch (this.currentView) {
      case 'my':
        serviceCall = this.projectService.getMyProjects();
        break;
      case 'available':
        serviceCall = this.projectService.getAvailableProjects();
        break;
      case 'applications':
        serviceCall = this.projectService.getMyApplications({
          page: this.filters.page,
          pageSize: this.filters.pageSize
        });
        break;
      case 'saved':
        serviceCall = this.projectService.getSavedProjects();
        break;
      case 'proposals':
        serviceCall = this.projectService.getAllProposals({
          page: this.filters.page,
          pageSize: this.filters.pageSize
        });
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

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warn';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      case 'pending': return 'secondary';
        case 'accepted': return 'success';
        case 'rejected': return 'danger';
        case 'withdrawn': return 'secondary';
      default: return 'info';
    }
  }

  getApplicationStatusSeverity(status: string): any {
    switch (status) {
      case 'pending': return 'warn';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'withdrawn': return 'secondary';
      default: return 'info';
    }
  }

  canEditProject(project: any): boolean {
    if (this.userRole === 'admin' || 'client') return true;

    return false;
  }

  canDeleteProject(project: any): boolean {
    if (this.userRole === 'admin') return true;

    const clientId = project?.client?.id || project?.project?.client?.id;
    const projectStatus = project?.status || project?.project?.status;

    if (this.userRole === 'client' &&
        clientId === this.tokenService.getUserId() &&
        projectStatus === 'open') return true;

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
    console.log('triggered')
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
        this.projectService.deleteProject(this.getProjectId(project)).subscribe({
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

  // Helper methods for safe property access
  getProjectTitle(project: any): string {
    return project?.title || project?.project?.title || 'Untitled Project';
  }

  getProjectCategory(project: any): string {
    return project?.category?.name || project?.project?.category?.name || '';
  }

  getProjectBudget(project: any): number {
    return project?.budget || project?.proposed_budget || project?.project?.budget || 0;
  }

  getProjectStatus(project: any): string {
    return project?.status || project?.project?.status || 'unknown';
  }

  getProjectClientName(project: any): string {
    return project?.client?.username ||
           project?.client?.first_name ||
           project?.project?.client?.username ||
           project?.project?.client?.first_name ||
           'Unknown Client';
  }

  getProjectProposalsCount(project: any): number {
    return project?.proposals_count || project?.project?.proposals_count || 0;
  }

  getProjectCreatedDate(project: any): string {
    return project?.created_at || project?.project?.created_at || new Date().toISOString();
  }

  getProjectId(project: any): string {
    const id = project?.id || project?.project?.id;
    return id ? String(id) : '';
  }
}
