import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { JobService } from '../../../../../service/job.service';
import { ProposalService } from '../../../../../service/proposal.service';
import { ChatInitiationService } from '../../../../../service/chat-initiation.service';
import { TokenService } from '../../../../utils/token.service';
import { Job } from '../../../../model/models';
import { RoleConst } from '../../../../const/api-const';
import { Nl2brPipe } from '../../../../pipes/nl2br.pipe';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    ChipModule,
    TagModule,
    DialogModule,
    FileUploadModule,
    Nl2brPipe
  ],
  providers: [MessageService],
  template: `
    <div class="card" *ngIf="job">
      <!-- Job Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">{{ job.title }}</h2>
          <p class="text-500 mt-2 mb-0">Posted by {{ job.client?.username || 'Unknown' }}</p>
        </div>
        <div class="flex gap-2">
          <p-tag
            [value]="job.is_open ? 'Open' : 'Closed'"
            [severity]="job.is_open ? 'success' : 'danger'">
          </p-tag>
          <button
            *ngIf="!isClient && job.is_open"
            pButton
            label="Submit Proposal"
            icon="pi pi-send"
            (click)="showProposalDialog()">
          </button>
          <button
            *ngIf="!isClient && hasApplied && job.client"
            pButton
            label="Contact Client"
            icon="pi pi-comments"
            class="p-button-secondary"
            (click)="contactClient()">
          </button>
          <button
            *ngIf="isClient && job.is_open"
            pButton
            icon="pi pi-pencil"
            label="Edit"
            class="p-button-secondary"
            [routerLink]="['/dashboard/jobs/edit', job.id]">
          </button>
        </div>
      </div>

      <!-- Job Details -->
      <div class="grid">
        <div class="col-12 md:col-8">
          <!-- Description -->
          <div class="mb-4">
            <h3>Description</h3>
            <p [innerHTML]="job.description | nl2br"></p>
          </div>

          <!-- Skills Required -->
<!--          <div class="mb-4">-->
<!--            <h3>Required Skills</h3>-->
<!--            <div class="flex flex-wrap gap-2">-->
<!--              <p-chip *ngFor="let skill of job.skills_required" [label]="skill"></p-chip>-->
<!--            </div>-->
<!--          </div>-->

          <!-- Attachments -->
<!--          <div class="mb-4" *ngIf="job.attachments">-->
<!--            <h3>Attachments</h3>-->
<!--            <div class="flex flex-wrap gap-2">-->
<!--              <a-->
<!--                *ngFor="let attachment of job.attachments"-->
<!--                [href]="attachment"-->
<!--                target="_blank"-->
<!--                class="p-button p-button-text">-->
<!--                <i class="pi pi-download"></i>-->
<!--                {{ getFileName(attachment) }}-->
<!--              </a>-->
<!--            </div>-->
<!--          </div>-->
        </div>

        <div class="col-12 md:col-4">
          <!-- Job Summary Card -->
          <p-card>
            <div class="mb-3">
              <label class="block font-bold mb-2">Budget</label>
              <span class="text-2xl">{{ job.budget | currency }}</span>
            </div>

            <div class="mb-3">
              <label class="block font-bold mb-2">Deadline</label>
              <span>{{ job.deadline | date:'mediumDate' }}</span>
            </div>

            <div class="mb-3">
              <label class="block font-bold mb-2">Location</label>
<!--              <span>{{ job.location || 'Not specified' }}</span>-->
            </div>

            <div class="mb-3">
              <label class="block font-bold mb-2">Posted</label>
              <span>{{ job.created_at | date }}</span>
            </div>

            <div *ngIf="isClient">
              <label class="block font-bold mb-2">Proposals</label>
              <a
                [routerLink]="['/dashboard/jobs', job.id, 'proposals']"
                class="text-primary hover:underline">
<!--                View {{ job.proposal_count || 0 }} proposals-->
              </a>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Submit Proposal Dialog -->
      <p-dialog
        [(visible)]="showDialog"
        [header]="'Submit Proposal for ' + job.title"
        [modal]="true"
        [style]="{width: '50vw'}"
        [draggable]="false"
        [resizable]="false">

        <form [formGroup]="proposalForm" (ngSubmit)="submitProposal()" class="p-fluid">
          <div class="field">
            <label for="bid_amount">Bid Amount</label>
            <p-inputNumber
              id="bid_amount"
              formControlName="bid_amount"
              [min]="0"
              [mode]="'currency'"
              [currency]="'USD'"
              [class.ng-invalid]="proposalForm.get('bid_amount')?.invalid && proposalForm.get('bid_amount')?.touched">
            </p-inputNumber>
            <small
              class="p-error"
              *ngIf="proposalForm.get('bid_amount')?.invalid && proposalForm.get('bid_amount')?.touched">
              Bid amount is required and must be greater than 0
            </small>
          </div>

          <div class="field">
            <label for="cover_letter">Cover Letter</label>
            <textarea
              id="cover_letter"
              pInputTextarea
              formControlName="cover_letter"
              [rows]="5"
              [autoResize]="true"
              placeholder="Explain why you're the best fit for this job..."
              [class.ng-invalid]="proposalForm.get('cover_letter')?.invalid && proposalForm.get('cover_letter')?.touched">
            </textarea>
            <small
              class="p-error"
              *ngIf="proposalForm.get('cover_letter')?.invalid && proposalForm.get('cover_letter')?.touched">
              Cover letter is required (minimum 100 characters)
            </small>
          </div>

          <div class="field">
            <label>Attachments</label>
            <p-fileUpload
              mode="basic"
              chooseLabel="Upload Files"
              [multiple]="true"
              accept="image/*,application/pdf"
              [maxFileSize]="5000000"
              (onSelect)="onFileSelect($event)">
            </p-fileUpload>
            <small class="text-500">Max file size: 5MB. Allowed types: Images, PDF</small>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <button
            pButton
            type="button"
            label="Cancel"
            class="p-button-text"
            (click)="showDialog = false">
          </button>
          <button
            pButton
            type="button"
            label="Submit Proposal"
            [loading]="loading"
            [disabled]="proposalForm.invalid || loading"
            (click)="submitProposal()">
          </button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputtext.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
      .p-inputnumber.ng-invalid.ng-touched .p-inputtext {
        border-color: var(--red-500);
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isClient = false;
  hasApplied = false;
  showDialog = false;
  loading = false;
  proposalForm!: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private proposalService: ProposalService,
    private chatInitiationService: ChatInitiationService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;

    this.initProposalForm();
    this.loadJob();
  }

  initProposalForm() {
    this.proposalForm = this.fb.group({
      bid_amount: [null, [Validators.required, Validators.min(1)]],
      cover_letter: ['', [Validators.required, Validators.minLength(100)]],
      attachments: [null]
    });
  }

  loadJob() {
    const jobId = this.route.snapshot.params['id'];
    if (!jobId) {
      this.router.navigate(['/dashboard/jobs']);
      return;
    }

    this.jobService.getJob(jobId).subscribe({
      next: (job) => {
        this.job = job;
        if (!this.isClient) {
          this.checkIfApplied();
        }
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job details'
        });
        this.router.navigate(['/dashboard/jobs']);
      }
    });
  }

  checkIfApplied() {
    if (this.job) {
      // Check if current user has applied to this job
      this.proposalService.getMyProposals().subscribe({
        next: (response) => {
          const proposals = response.results || [];
          this.hasApplied = proposals.some((proposal: any) => proposal.job === this.job!.id);
        },
        error: (error) => {
          console.error('Error checking proposals:', error);
        }
      });
    }
  }

  contactClient() {
    if (this.job?.client) {
      this.chatInitiationService.chatWithJobPoster(
        this.job.id,
        this.job.client.id,
        this.job.client.username
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
  }

  showProposalDialog() {
    if (!this.job?.is_open) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'This job is no longer accepting proposals'
      });
      return;
    }
    this.showDialog = true;
  }

  submitProposal() {
    if (this.proposalForm.valid && this.job) {
      this.loading = true;

      const formData = {
        job: this.job.id,
        ...this.proposalForm.value
      };

      // Handle file uploads if needed
      if (this.selectedFiles.length > 0) {
        formData.attachments = this.selectedFiles;
      }

      this.proposalService.createProposal(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Proposal submitted successfully'
          });
          this.loading = false;
          this.showDialog = false;
          this.proposalForm.reset();
          this.selectedFiles = [];
        },
        error: (error) => {
          console.error('Error submitting proposal:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit proposal. Please try again.'
          });
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.proposalForm.controls).forEach(key => {
        const control = this.proposalForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onFileSelect(event: any) {
    this.selectedFiles = event.files;
  }

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }
}
