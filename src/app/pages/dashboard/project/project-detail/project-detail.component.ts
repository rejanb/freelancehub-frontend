import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProjectService } from '../../../../../service/project.service';
import { ChatInitiationService } from '../../../../../service/chat-initiation.service';
import { TokenService } from '../../../../utils/token.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    DividerModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    InputTextarea
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="project-detail-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center p-6">
        <p-progressSpinner></p-progressSpinner>
        <p class="mt-3">Loading project details...</p>
      </div>

      <!-- Project Not Found -->
      <div *ngIf="!loading && !project" class="text-center p-6">
        <i class="pi pi-exclamation-triangle text-6xl text-400 mb-3"></i>
        <h3>Project Not Found</h3>
        <p class="text-600 mb-4">The project you're looking for doesn't exist or is no longer available.</p>
        <button pButton label="Back to Projects" routerLink="/dashboard/projects" class="p-button-outlined"></button>
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
                <span><i class="pi pi-user mr-2"></i>{{ project.client?.username || 'Client' }}</span>
                <span><i class="pi pi-calendar mr-2"></i>Posted {{ project.created_at | date:'mediumDate' }}</span>
                <p-tag [value]="project.status" [severity]="getStatusSeverity(project.status)"></p-tag>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 mb-2">\${{ project.budget | number:'1.0-0' }}</div>

              <!-- Action Buttons -->
              <div class="flex gap-2 flex-wrap">
                <!-- Apply button for freelancers -->
                <button
                  *ngIf="canApplyToProject()"
                  pButton
                  label="Apply for Project"
                  icon="pi pi-send"
                  class="p-button-success p-button-sm"
                  (click)="applyToProject()">
                </button>

                <!-- Save/Unsave button -->
                <button
                  *ngIf="userRole === 'freelancer' && !canEditProject()"
                  pButton
                  [label]="isProjectSaved ? 'Unsave' : 'Save'"
                  [icon]="isProjectSaved ? 'pi pi-heart-fill' : 'pi pi-heart'"
                  [class]="isProjectSaved ? 'p-button-outlined p-button-danger p-button-sm' : 'p-button-outlined p-button-sm'"
                  (click)="toggleSaveProject()"
                  [loading]="savingProject">
                </button>

                <!-- Chat Buttons -->
                <button
                  *ngIf="canChatWithClient()"
                  pButton
                  label="Chat with Client"
                  icon="pi pi-comments"
                  class="p-button-outlined p-button-success p-button-sm"
                  (click)="chatWithClient()">
                </button>

                <button
                  *ngIf="canChatWithFreelancer()"
                  pButton
                  label="Chat with Freelancer"
                  icon="pi pi-comments"
                  class="p-button-outlined p-button-info p-button-sm"
                  (click)="chatWithFreelancer()">
                </button>

                <!-- Edit/Delete for owners -->
                <button
                  *ngIf="canEditProject()"
                  pButton
                  label="Edit"
                  icon="pi pi-pencil"
                  class="p-button-outlined p-button-sm"
                  [routerLink]="['/dashboard/projects/form', project.id]">
                </button>

                <button
                  *ngIf="canDeleteProject()"
                  pButton
                  label="Delete"
                  icon="pi pi-trash"
                  class="p-button-outlined p-button-danger p-button-sm"
                  (click)="confirmDelete()">
                </button>
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

            <!-- Project Attachments -->
            <div class="card mb-4" *ngIf="project.attachments?.length">
              <h2 class="text-xl font-semibold mb-3">Project Attachments</h2>
              <div class="flex flex-column gap-3">
                <div *ngFor="let attachment of project.attachments" 
                     class="flex align-items-center justify-content-between p-3 border-round surface-border surface-ground">
                  <div class="flex align-items-center gap-3">
                    <i [class]="getFileIcon(attachment.file_name)" class="text-2xl"></i>
                    <div>
                      <div class="font-medium">{{ attachment.file_name }}</div>
                      <div class="text-sm text-600">
                        {{ formatFileSize(attachment.file_size) }} • 
                        {{ attachment.file_type | titlecase }} • 
                        Uploaded {{ attachment.uploaded_at | date:'short' }}
                      </div>
                    </div>
                  </div>
                  <button pButton 
                          icon="pi pi-download" 
                          class="p-button-rounded p-button-outlined p-button-sm"
                          (click)="downloadAttachment(attachment)"
                          pTooltip="Download File">
                  </button>
                </div>
              </div>
            </div>

            <!-- Contract Documents -->
            <div class="card mb-4" *ngIf="project.contract && (userRole === 'client' || userRole === 'admin' || project.selected_freelancer?.id === currentUserId)">
              <div class="flex justify-content-between align-items-center mb-3">
                <h2 class="text-xl font-semibold m-0">Contract Documents</h2>
                <button pButton 
                        *ngIf="userRole === 'client' || project.selected_freelancer?.id === currentUserId"
                        label="Upload File" 
                        icon="pi pi-upload" 
                        class="p-button-sm"
                        (click)="showContractUploadDialog()">
                </button>
              </div>
              
              <div *ngIf="contractFiles.length === 0" class="text-center py-4">
                <i class="pi pi-file text-4xl text-400 mb-2"></i>
                <p class="text-600">No contract documents yet</p>
                <p class="text-sm text-500">Upload contracts, deliverables, and other project documents here.</p>
              </div>
              
              <div *ngIf="contractFiles.length > 0" class="flex flex-column gap-3">
                <div *ngFor="let file of contractFiles" 
                     class="flex align-items-center justify-content-between p-3 border-round surface-border surface-ground">
                  <div class="flex align-items-center gap-3">
                    <i [class]="getFileIcon(file.file_name)" class="text-2xl"></i>
                    <div>
                      <div class="font-medium">{{ file.file_name }}</div>
                      <div class="text-sm text-600">
                        {{ formatFileSize(file.file_size) }} • 
                        {{ file.file_type | titlecase }} • 
                        Uploaded by {{ file.uploaded_by.username }} • 
                        {{ file.uploaded_at | date:'short' }}
                      </div>
                      <div *ngIf="file.description" class="text-sm text-500 mt-1">
                        {{ file.description }}
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <button pButton 
                            icon="pi pi-download" 
                            class="p-button-rounded p-button-outlined p-button-sm"
                            (click)="downloadAttachment(file)"
                            pTooltip="Download File">
                    </button>
                    <button pButton 
                            *ngIf="file.uploaded_by.id === currentUserId || userRole === 'client'"
                            icon="pi pi-times" 
                            class="p-button-rounded p-button-text p-button-sm p-button-danger"
                            (click)="deleteContractFile(file.id)"
                            pTooltip="Delete File">
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Status -->
            <div class="card mb-4" *ngIf="project.selected_freelancer">
              <h2 class="text-xl font-semibold mb-3">Assigned Freelancer</h2>
              <div class="flex align-items-center gap-3">
                <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-800 border-round"
                     style="width: 3rem; height: 3rem; font-size: 1.2rem;">
                  {{ project.selected_freelancer.username?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium">{{ project.selected_freelancer.username }}</div>
                  <div class="text-600 text-sm">{{ project.selected_freelancer.user_type | titlecase }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 lg:col-4">
            <!-- Project Info -->
            <div class="card mb-4">
              <h3 class="text-lg font-semibold mb-3">Project Information</h3>
              <div class="flex flex-column gap-3">
                <div>
                  <span class="font-medium text-900">Budget:</span>
                  <span class="ml-2 text-green-600 font-bold">\${{ project.budget | number:'1.0-0' }}</span>
                </div>
                <div>
                  <span class="font-medium text-900">Deadline:</span>
                  <span class="ml-2">{{ project.deadline | date:'mediumDate' }}</span>
                </div>
                <div>
                  <span class="font-medium text-900">Category:</span>
                  <span class="ml-2">{{ project.category?.name || 'Uncategorized' }}</span>
                </div>
                <div *ngIf="project.location">
                  <span class="font-medium text-900">Location:</span>
                  <span class="ml-2">{{ project.location }}</span>
                </div>
                <div>
                  <span class="font-medium text-900">Created:</span>
                  <span class="ml-2">{{ project.created_at | date:'short' }}</span>
                </div>
                <div>
                  <span class="font-medium text-900">Updated:</span>
                  <span class="ml-2">{{ project.updated_at | date:'short' }}</span>
                </div>
              </div>
            </div>

            <!-- Proposals -->
            <div class="card" *ngIf="userRole === 'client' || userRole === 'admin'">
              <h3 class="text-lg font-semibold mb-3">Proposals</h3>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 mb-2">{{ project.proposal_count || 0 }}</div>
                <p class="text-600 mb-3">Proposals received</p>
                <button
                  pButton
                  label="View Proposals"
                  icon="pi pi-users"
                  class="p-button-outlined w-full"
                  [routerLink]="['/dashboard/projects', project.id, 'proposals']"
                  [disabled]="!project.proposal_count">
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Back Navigation -->
        <div class="mt-4">
          <button pButton label="Back to Projects" icon="pi pi-arrow-left" class="p-button-outlined" routerLink="/dashboard/projects"></button>
        </div>
      </div>
    </div>

    <!-- Contract File Upload Dialog -->
    <p-dialog header="Upload Contract Document" 
              [(visible)]="showContractUpload" 
              [modal]="true" 
              [style]="{ width: '500px' }"
              [draggable]="false" 
              [resizable]="false">
      <div class="flex flex-column gap-4">
        <div class="field">
          <label for="contractFile" class="block font-medium mb-2">Select File</label>
          <input type="file" 
                 id="contractFile" 
                 #contractFileInput
                 (change)="onContractFileSelected($event)"
                 accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.svg"
                 class="w-full p-2 border-1 border-round">
          <small class="text-600">Max file size: 10MB</small>
        </div>

        <div class="field">
          <label for="fileType" class="block font-medium mb-2">Document Type</label>
          <p-dropdown id="fileType" 
                      [(ngModel)]="contractUploadForm.fileType" 
                      [options]="contractFileTypes" 
                      optionLabel="label" 
                      optionValue="value"
                      placeholder="Select document type"
                      class="w-full">
          </p-dropdown>
        </div>

        <div class="field">
          <label for="description" class="block font-medium mb-2">Description (Optional)</label>
          <textarea pInputTextarea 
                    id="description" 
                    [(ngModel)]="contractUploadForm.description" 
                    rows="3" 
                    class="w-full"
                    placeholder="Brief description of the document...">
          </textarea>
        </div>

        <div class="flex gap-2 justify-content-end">
          <button pButton 
                  label="Cancel" 
                  class="p-button-outlined" 
                  (click)="closeContractUploadDialog()">
          </button>
          <button pButton 
                  label="Upload" 
                  [disabled]="!selectedContractFile || uploadingContractFile"
                  [loading]="uploadingContractFile"
                  (click)="uploadContractFile()">
          </button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-height-3 {
      line-height: 1.75;
    }
  `]
})
export class ProjectDetailComponent implements OnInit {
  project: any = null;
  loading = true;
  projectId!: string;
  currentUserId?: number;
  userRole: string = '';
  isProjectSaved = false;
  savingProject = false;

  // Contract file upload
  contractFiles: any[] = [];
  showContractUpload = false;
  selectedContractFile: File | null = null;
  uploadingContractFile = false;
  contractUploadForm = {
    fileType: 'contract',
    description: ''
  };
  contractFileTypes = [
    { label: 'Contract Document', value: 'contract' },
    { label: 'Deliverable', value: 'deliverable' },
    { label: 'Invoice', value: 'invoice' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private chatInitiationService: ChatInitiationService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;
    this.userRole = this.tokenService.getUserRole();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProject();
      }
    });
  }

  loadProject() {
    this.loading = true;
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
        
        // Check if project is saved (for freelancers only)
        if (this.userRole === 'freelancer') {
          this.checkIfProjectSaved();
        }
        
        // Load contract files if project has a contract
        if (this.project.contract) {
          this.loadContractFiles();
        }
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.project = null;
        this.loading = false;
      }
    });
  }

  checkIfProjectSaved() {
    this.projectService.isProjectSaved(this.projectId).subscribe({
      next: (response) => {
        this.isProjectSaved = response.is_saved;
      },
      error: (error) => {
        console.error('Error checking save status:', error);
        this.isProjectSaved = false;
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

  canChatWithClient(): boolean {
    return this.project?.selected_freelancer?.id === this.currentUserId &&
           this.project?.client?.id &&
           this.project?.status === 'in_progress';
  }

  canChatWithFreelancer(): boolean {
    return this.project?.client?.id === this.currentUserId &&
           this.project?.selected_freelancer?.id &&
           this.project?.status === 'in_progress';
  }

  canEditProject(): boolean {
    return this.project?.client?.id === this.currentUserId || this.userRole === 'admin';
  }

  canDeleteProject(): boolean {
    return this.project?.client?.id === this.currentUserId || this.userRole === 'admin';
  }

  canApplyToProject(): boolean {


    // Freelancers can apply if:
    // 1. User is a freelancer
    // 2. Project is open (not assigned to anyone)
    // 3. User is not the project owner
    // 4. Project has no assigned freelancer
    return this.userRole === 'freelancer' &&
           this.project?.status === 'open' &&
           this.project?.client?.id !== this.currentUserId &&
           (this.project?.selected_freelancer === null || this.project?.selected_freelancer === undefined);
  }

  applyToProject() {
    // For now, navigate to the proposals view where we can add form functionality
    // Later this can be changed to a dedicated proposal form route
    this.router.navigate(['/dashboard/projects', this.project.id, 'proposals']);
  }

  chatWithClient() {
    if (!this.project?.client?.id) return;

    const clientName = this.project.client.username || this.project.client.first_name || 'Client';
    this.chatInitiationService.chatWithProjectParty(
      this.project.id,
      this.project.client.id,
      clientName
    ).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: result.success ? 'success' : 'warn',
          summary: result.success ? 'Chat Started' : 'Cannot Start Chat',
          detail: result.message
        });
      },
      error: (error) => {
        console.error('Error initiating chat:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to start chat'
        });
      }
    });
  }

  chatWithFreelancer() {
    if (!this.project?.selected_freelancer?.id) return;

    const freelancerName = this.project.selected_freelancer.username ||
                          this.project.selected_freelancer.first_name || 'Freelancer';
    this.chatInitiationService.chatWithProjectParty(
      this.project.id,
      this.project.selected_freelancer.id,
      freelancerName
    ).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: result.success ? 'success' : 'warn',
          summary: result.success ? 'Chat Started' : 'Cannot Start Chat',
          detail: result.message
        });
      },
      error: (error) => {
        console.error('Error initiating chat:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to start chat'
        });
      }
    });
  }

  toggleSaveProject() {
    this.savingProject = true;
    
    if (this.isProjectSaved) {
      // Unsave the project
      this.projectService.unsaveProject(this.projectId).subscribe({
        next: () => {
          this.isProjectSaved = false;
          this.savingProject = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Project Unsaved',
            detail: 'Project removed from your saved list'
          });
        },
        error: (error) => {
          console.error('Error unsaving project:', error);
          this.savingProject = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to unsave project'
          });
        }
      });
    } else {
      // Save the project
      this.projectService.saveProject(this.projectId).subscribe({
        next: () => {
          this.isProjectSaved = true;
          this.savingProject = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Project Saved',
            detail: 'Project added to your saved list'
          });
        },
        error: (error) => {
          console.error('Error saving project:', error);
          this.savingProject = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save project'
          });
        }
      });
    }
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject();
      }
    });
  }

  deleteProject() {
    this.projectService.deleteProject(this.project.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Project deleted successfully'
        });
        this.router.navigate(['/dashboard/projects']);
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

  getFileIcon(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'pi pi-file-excel text-green-500';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file text-orange-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return 'pi pi-image text-purple-500';
      case 'txt':
      case 'rtf':
        return 'pi pi-file-edit text-gray-500';
      default:
        return 'pi pi-file text-gray-500';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadAttachment(attachment: any) {
    window.open(attachment.file_url, '_blank');
  }

  // Contract file methods
  loadContractFiles() {
    this.projectService.getContractFiles(this.projectId).subscribe({
      next: (files) => {
        this.contractFiles = files;
      },
      error: (error) => {
        console.error('Error loading contract files:', error);
        this.contractFiles = [];
      }
    });
  }

  showContractUploadDialog() {
    this.showContractUpload = true;
    this.contractUploadForm = {
      fileType: 'contract',
      description: ''
    };
    this.selectedContractFile = null;
  }

  closeContractUploadDialog() {
    this.showContractUpload = false;
    this.selectedContractFile = null;
    this.contractUploadForm = {
      fileType: 'contract',
      description: ''
    };
  }

  onContractFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size too large. Maximum 10MB allowed.'
        });
        return;
      }
      this.selectedContractFile = file;
    }
  }

  uploadContractFile() {
    if (!this.selectedContractFile) return;

    this.uploadingContractFile = true;
    const formData = new FormData();
    formData.append('file', this.selectedContractFile);
    formData.append('file_type', this.contractUploadForm.fileType);
    formData.append('description', this.contractUploadForm.description);

    this.projectService.uploadContractFile(this.projectId, formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contract file uploaded successfully'
        });
        this.closeContractUploadDialog();
        this.loadContractFiles();
        this.uploadingContractFile = false;
      },
      error: (error) => {
        console.error('Error uploading contract file:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload contract file'
        });
        this.uploadingContractFile = false;
      }
    });
  }

  deleteContractFile(fileId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contract file?',
      header: 'Delete Contract File',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.projectService.deleteContractFile(this.projectId, fileId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Contract file deleted successfully'
            });
            this.loadContractFiles();
          },
          error: (error) => {
            console.error('Error deleting contract file:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete contract file'
            });
          }
        });
      }
    });
  }
}
