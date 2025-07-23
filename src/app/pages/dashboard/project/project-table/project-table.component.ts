import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectService } from '../../../../../service/project.service';
import { ChatInitiationService } from '../../../../../service/chat-initiation.service';
import { TokenService } from '../../../../utils/token.service';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../../model/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, FormsModule, IconField, InputIcon, Toast, ConfirmDialog],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ProjectTableComponent implements OnInit {
  projects: any[] = [];
  filteredProjects: any[] = [];
  searchTerm = '';
  totalRecords = 0;
  rows = 12;
  loading = false;
  currentUserId?: number;

  constructor(
    private projectService: ProjectService,
    private chatInitiationService: ChatInitiationService,
    private tokenService: TokenService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;
  }

  ngOnInit() {
    // Initial load
    this.loadProjects({ first: 0, rows: this.rows });
  }

  loadProjects(event: any) {
    this.loading = true;
    const page = event.first / event.rows + 1;
    const pageSize = event.rows;
    const search = this.searchTerm;
    this.projectService.getProjects({ page, pageSize, search }).subscribe({
      next: (data: ApiResponse<any>) => {
        console.log("my my ", data.results)
          this.projects = data.results;
          this.filteredProjects =  data.results;
          this.totalRecords = data.count;
        console.log(this.filteredProjects)
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // onSearch() {
  //   const term = this.searchTerm.toLowerCase();
  //   this.filteredProjects = this.projects.filter(p =>
  //     p.title?.toLowerCase().includes(term) ||
  //     p.description?.toLowerCase().includes(term)
  //   );
  // }
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    // Reset to first page and reload
    this.loadProjects({ first: 0, rows: this.rows });
  }

  onUpdate(project: any) {
    // Navigate to project detail view
    this.router.navigate(['/dashboard/projects', project.id]);
  }

  onViewProject(project: any) {
    // Navigate to project detail view
    this.router.navigate(['/dashboard/projects', project.id]);
  }

  onEditProject(project: any) {
    // Navigate to project form for editing
    this.router.navigate(['/dashboard/projects/form', project.id]);
  }

  onDelete(project: any) {
      this.projectService.deleteProject(project.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
          this.loadProjects({ first: 0, rows: this.rows });
        },
        error: (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error?.detail || 'Failed to delete record' });
        }
      });

  }

  // PrimeNG lazy loading event for pagination, sorting, filtering
  onLazyLoad(event: any) {
    // Update rows if changed
    if (event.rows && event.rows !== this.rows) {
      this.rows = event.rows;
    }
    this.loadProjects(event);
  }

    onAddProject() {
    this.router.navigate(['/dashboard/project/add'], { state: { header: 'Add' } });
  }

  /**
   * Chat with client (for freelancers working on project)
   */
  chatWithClient(project: any) {
    if (!project.client || !project.client.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Start Chat',
        detail: 'Client information not available'
      });
      return;
    }

    const clientName = project.client.username || project.client.first_name || 'Client';
    this.chatInitiationService.chatWithProjectParty(
      project.id,
      project.client.id,
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

  /**
   * Chat with freelancer (for clients)
   */
  chatWithFreelancer(project: any) {
    if (!project.selected_freelancer || !project.selected_freelancer.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot Start Chat',
        detail: 'No freelancer assigned to this project'
      });
      return;
    }

    const freelancerName = project.selected_freelancer.username || 
                          project.selected_freelancer.first_name || 'Freelancer';
    this.chatInitiationService.chatWithProjectParty(
      project.id,
      project.selected_freelancer.id,
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

  /**
   * Check if current user can chat with project client
   */
  canChatWithClient(project: any): boolean {
    return project.selected_freelancer?.id === this.currentUserId && 
           project.client?.id && 
           project.status === 'in_progress';
  }

  /**
   * Check if current user can chat with project freelancer
   */
  canChatWithFreelancer(project: any): boolean {
    return project.client?.id === this.currentUserId && 
           project.selected_freelancer?.id && 
           project.status === 'in_progress';
  }



  delete(event: Event, project: any) {
    console.log(project)

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Are you sure?',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.onDelete(project);

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  protected readonly event = event;
}
