import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { DisputeService } from '../../../../../service/dispute.service';

@Component({
  selector: 'app-dispute-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    FileUploadModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-8 md:col-offset-2">
        <p-card>
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Create Dispute</h2>
            <button 
              pButton 
              icon="pi pi-arrow-left" 
              label="Back"
              class="p-button-text"
              routerLink="/dashboard/dispute">
            </button>
          </div>

          <form [formGroup]="disputeForm" (ngSubmit)="onSubmit()" class="p-fluid">
            <!-- Title -->
            <div class="field">
              <label for="title" class="font-bold">Title *</label>
              <input 
                id="title" 
                type="text" 
                pInputText 
                formControlName="title"
                [class.ng-invalid]="disputeForm.get('title')?.invalid && disputeForm.get('title')?.touched">
              <small 
                class="p-error" 
                *ngIf="disputeForm.get('title')?.invalid && disputeForm.get('title')?.touched">
                Title is required
              </small>
            </div>

            <!-- Type -->
            <div class="field">
              <label for="type" class="font-bold">Type *</label>
              <p-dropdown
                id="type"
                formControlName="type"
                [options]="typeOptions"
                placeholder="Select dispute type"
                [class.ng-invalid]="disputeForm.get('type')?.invalid && disputeForm.get('type')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="disputeForm.get('type')?.invalid && disputeForm.get('type')?.touched">
                Type is required
              </small>
            </div>

            <!-- Description -->
            <div class="field">
              <label for="description" class="font-bold">Description *</label>
              <textarea 
                id="description" 
                pInputTextarea 
                formControlName="description"
                [rows]="5"
                [autoResize]="true"
                placeholder="Describe the issue in detail..."
                [class.ng-invalid]="disputeForm.get('description')?.invalid && disputeForm.get('description')?.touched">
              </textarea>
              <small 
                class="p-error" 
                *ngIf="disputeForm.get('description')?.invalid && disputeForm.get('description')?.touched">
                Description is required (minimum 50 characters)
              </small>
            </div>

            <!-- Desired Resolution -->
            <div class="field">
              <label for="desired_resolution" class="font-bold">Desired Resolution *</label>
              <textarea 
                id="desired_resolution" 
                pInputTextarea 
                formControlName="desired_resolution"
                [rows]="3"
                [autoResize]="true"
                placeholder="What outcome are you seeking?"
                [class.ng-invalid]="disputeForm.get('desired_resolution')?.invalid && disputeForm.get('desired_resolution')?.touched">
              </textarea>
              <small 
                class="p-error" 
                *ngIf="disputeForm.get('desired_resolution')?.invalid && disputeForm.get('desired_resolution')?.touched">
                Desired resolution is required
              </small>
            </div>

            <!-- Resolution Amount -->
            <div class="field" *ngIf="disputeForm.get('type')?.value === 'payment'">
              <label for="resolution_amount" class="font-bold">Resolution Amount</label>
              <input 
                id="resolution_amount" 
                type="number" 
                pInputText 
                formControlName="resolution_amount"
                min="0"
                step="0.01">
            </div>

            <!-- Attachments -->
            <div class="field">
              <label class="font-bold mb-2">Attachments</label>
              <p-fileUpload
                #fileUpload
                mode="advanced"
                [multiple]="true"
                accept="image/*,application/pdf"
                [maxFileSize]="10000000"
                [customUpload]="true"
                (uploadHandler)="onFileSelect($event)"
                chooseLabel="Add Files"
                cancelLabel="Clear">
                <ng-template pTemplate="content">
                  <div *ngIf="selectedFiles.length > 0" class="mt-2">
                    <div *ngFor="let file of selectedFiles" class="flex align-items-center gap-2 mb-2">
                      <i class="pi pi-file"></i>
                      <span>{{ file.name }}</span>
                      <i class="pi pi-times cursor-pointer" (click)="removeFile(file)"></i>
                    </div>
                  </div>
                </ng-template>
              </p-fileUpload>
              <small class="text-500">
                Supported formats: Images, PDF. Max size: 10MB per file.
              </small>
            </div>

            <!-- Submit Button -->
            <button 
              pButton 
              type="submit" 
              label="Submit Dispute"
              [loading]="loading"
              [disabled]="disputeForm.invalid || loading">
            </button>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputtext.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-trigger,
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-label {
        border-color: var(--red-500);
      }
    }
  `]
})
export class DisputeFormComponent implements OnInit {
  disputeForm!: FormGroup;
  loading = false;
  contractId?: number;
  selectedFiles: File[] = [];

  typeOptions = [
    { label: 'Payment Issue', value: 'payment' },
    { label: 'Quality Issue', value: 'quality' },
    { label: 'Communication Issue', value: 'communication' },
    { label: 'Scope Issue', value: 'scope' },
    { label: 'Deadline Issue', value: 'deadline' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private disputeService: DisputeService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.contractId = Number(this.route.snapshot.params['contractId']);
    if (!this.contractId) {
      this.router.navigate(['/dashboard/dispute']);
      return;
    }
  }

  initForm() {
    this.disputeForm = this.fb.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      desired_resolution: ['', [Validators.required]],
      resolution_amount: [null]
    });
  }

  onFileSelect(event: any) {
    this.selectedFiles = [...this.selectedFiles, ...event.files];
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onSubmit() {
    if (this.disputeForm.valid && this.contractId) {
      this.loading = true;

      const disputeData = {
        ...this.disputeForm.value,
        contract: this.contractId,
        attachments: this.selectedFiles
      };

      this.disputeService.createDispute(disputeData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dispute created successfully'
          });
          this.router.navigate(['/dashboard/dispute']);
        },
        error: (error) => {
          console.error('Error creating dispute:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create dispute'
          });
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.disputeForm.controls).forEach(key => {
        const control = this.disputeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
} 