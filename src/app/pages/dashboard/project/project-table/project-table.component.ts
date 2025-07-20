import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProjectService } from '../../../../../service/project.service';
import {FormsModule} from '@angular/forms';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Router} from '@angular/router';
import {ApiResponse} from '../../../../model/models';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';

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

  constructor(private projectService: ProjectService,
              private router: Router,
              private confirmationService: ConfirmationService,
              private messageService: MessageService
  ) {}

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
    // Implement update logic (e.g. open dialog or navigate)
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
