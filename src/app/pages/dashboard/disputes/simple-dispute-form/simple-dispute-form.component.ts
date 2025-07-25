import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { DisputeService, DisputeCreate } from '../../../../../service/dispute.service';
import { ProjectService } from '../../../../../service/project.service';
import { ContractService } from '../../../../../service/contract.service';

@Component({
  selector: 'app-simple-dispute-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-4">
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <h3 class="m-0">Report a Dispute</h3>
            <button
              pButton
              icon="pi pi-arrow-left"
              label="Back"
              class="p-button-text"
              routerLink="/dashboard/dispute">
            </button>
          </div>
        </ng-template>

        <form [formGroup]="disputeForm" (ngSubmit)="onSubmit()" class="p-fluid">
          <!-- Title -->
          <div class="field">
            <label for="title" class="font-bold">Dispute Title *</label>
            <input
              style="width: 100%;"
              id="title"
              pInputText
              formControlName="title"
              placeholder="Brief description of the issue"
              [class.ng-invalid]="disputeForm.get('title')?.invalid && disputeForm.get('title')?.touched">
            <small class="p-error" *ngIf="disputeForm.get('title')?.invalid && disputeForm.get('title')?.touched">
              Title is required
            </small>
          </div>

          <!-- Dispute Type -->
          <div class="field">
            <label for="type" class="font-bold">Issue Type *</label>
            <p-dropdown
              id="type"
              formControlName="type"
              [options]="disputeTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="Select the type of issue">
            </p-dropdown>
            <small class="p-error" *ngIf="disputeForm.get('type')?.invalid && disputeForm.get('type')?.touched">
              Please select an issue type
            </small>
          </div>

          <!-- Priority -->
          <div class="field">
            <label for="priority" class="font-bold">Priority</label>
            <p-dropdown
              id="priority"
              formControlName="priority"
              [options]="priorities"
              optionLabel="label"
              optionValue="value"
              placeholder="Select priority level">
            </p-dropdown>
          </div>

          <!-- Project Selection -->
          <div class="field">
            <label for="project" class="font-bold">Related Project</label>
            <p-dropdown
              id="project"
              formControlName="project_id"
              [options]="projects"
              optionLabel="title"
              optionValue="id"
              placeholder="Select a project (optional)"
              [filter]="true"
              filterBy="title"
              [showClear]="true"
              [loading]="loadingProjects">
            </p-dropdown>
          </div>

          <!-- Contract Selection -->
          <div class="field">
            <label for="contract" class="font-bold">Related Contract</label>
            <p-dropdown
              id="contract"
              formControlName="contract_id"
              [options]="contracts"
              optionLabel="display_name"
              optionValue="id"
              placeholder="Select a contract (optional)"
              [filter]="true"
              filterBy="display_name"
              [showClear]="true"
              [loading]="loadingContracts">
            </p-dropdown>
          </div>

          <!-- Description -->
          <div class="field">
            <label  for="description" class="font-bold">Description *</label>
            <textarea
              style="width: 100%"
              id="description"
              pInputTextarea
              formControlName="description"
              rows="5"
              placeholder="Please provide detailed information about the issue, including what happened, when it occurred, and what resolution you're seeking..."
              [class.ng-invalid]="disputeForm.get('description')?.invalid && disputeForm.get('description')?.touched">
            </textarea>
            <small class="p-error" *ngIf="disputeForm.get('description')?.invalid && disputeForm.get('description')?.touched">
              Description is required
            </small>
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-2 mt-4">
            <button
              pButton
              type="submit"
              label="Submit Dispute"
              icon="pi pi-send"
              [loading]="submitting"
              [disabled]="disputeForm.invalid">
            </button>
            <button
              pButton
              type="button"
              label="Cancel"
              icon="pi pi-times"
              class="p-button-secondary"
              routerLink="/dashboard/dispute">
            </button>
          </div>
        </form>
      </p-card>
    </div>

    <p-toast></p-toast>
  `,
  styles: [`
    .container {
      max-width: 800px;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .font-bold {
      font-weight: 600;
      margin-bottom: 0.5rem;
      display: block;
    }

    .p-error {
      color: #e24c4c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class SimpleDisputeFormComponent implements OnInit {
  disputeForm!: FormGroup;
  submitting = false;
  loadingProjects = false;
  loadingContracts = false;

  projects: any[] = [];
  contracts: any[] = [];

  disputeTypes = [
    { label: 'Payment Issue', value: 'payment' },
    { label: 'Work Quality', value: 'quality' },
    { label: 'Communication Issue', value: 'communication' },
    { label: 'Scope Disagreement', value: 'scope' },
    { label: 'Deadline Issue', value: 'deadline' },
    { label: 'Contract Breach', value: 'contract_breach' },
    { label: 'Other', value: 'other' }
  ];

  priorities = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
  ];

  constructor(
    private fb: FormBuilder,
    private disputeService: DisputeService,
    private projectService: ProjectService,
    private contractService: ContractService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadProjects();
    this.loadContracts();
    this.checkRouteParams();
  }

  initForm() {
    this.disputeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(50)]],
      priority: ['medium'],
      project_id: [null],
      contract_id: [null]
    });
  }

  loadProjects() {
    this.loadingProjects = true;
    this.projectService.getProjects({ pageSize: 100 }).subscribe({
      next: (response) => {
        this.projects = response.results || [];
        this.loadingProjects = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.loadingProjects = false;
      }
    });
  }

  loadContracts() {
    this.loadingContracts = true;
    this.contractService.getContracts({ page_size: 100 }).subscribe({
      next: (response) => {
        this.contracts = (response.results || []).map(contract => ({
          ...contract,
          display_name: `Contract #${contract.id} - ${contract.status} (${contract.total_payment})`
        }));
        this.loadingContracts = false;
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
        this.loadingContracts = false;
      }
    });
  }

  checkRouteParams() {
    this.route.queryParams.subscribe(params => {
      if (params['project_id']) {
        this.disputeForm.patchValue({ project_id: parseInt(params['project_id']) });
      }
      if (params['contract_id']) {
        this.disputeForm.patchValue({ contract_id: parseInt(params['contract_id']) });
      }
    });
  }

  onSubmit() {
    if (this.disputeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;

    const formValue = this.disputeForm.value;
    const disputeData: DisputeCreate = {
      title: formValue.title,
      type: formValue.type,
      description: formValue.description,
      priority: formValue.priority
    };

    // Add project or contract ID if selected
    if (formValue.project_id) {
      disputeData.project_id = formValue.project_id;
    }

    if (formValue.contract_id) {
      disputeData.contract_id = formValue.contract_id;
    }

    this.disputeService.createDispute(disputeData).subscribe({
      next: (dispute) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Dispute submitted successfully'
        });

        // Navigate to dispute detail page
        setTimeout(() => {
          this.router.navigate(['/dashboard/dispute', dispute.id]);
        }, 1500);
      },
      error: (error) => {
        console.error('Error creating dispute:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || 'Failed to submit dispute'
        });
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.disputeForm.controls).forEach(key => {
      const control = this.disputeForm.get(key);
      control?.markAsTouched();
    });
  }
}
