import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { JobService } from '../../../../../service/job.service';
import { ProposalService } from '../../../../../service/proposal.service';
import { ContractService } from '../../../../../service/contract.service';
import { Job, Proposal } from '../../../../model/models';
import { Nl2brPipe } from '../../../../pipes/nl2br.pipe';

@Component({
  selector: 'app-job-proposals',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    CardModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    AvatarModule,
    Nl2brPipe
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Proposals</h2>
          <p class="text-500 mt-2 mb-0" *ngIf="job">
            For: {{ job.title }}
          </p>
        </div>
        <button
          pButton
          icon="pi pi-arrow-left"
          label="Back to Job"
          class="p-button-text"
          [routerLink]="['/dashboard/jobs', jobId]">
        </button>
      </div>

      <!-- Proposals Table -->
      <p-table
        [value]="proposals"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [totalRecords]="totalRecords"
        [rowsPerPageOptions]="[10, 25, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} proposals"
        (onPage)="onPageChange($event)">

        <ng-template pTemplate="header">
          <tr>
            <th>Freelancer</th>
            <th>Bid Amount</th>
            <th>Submitted</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-proposal>
          <tr>
            <td>
              <div class="flex align-items-center gap-2">
                <p-avatar
                  [image]="proposal.freelancer?.profile_picture"
                  shape="circle"
                  size="normal">
                </p-avatar>
                <span>{{ proposal.freelancer?.username }}</span>
              </div>
            </td>
            <td>{{ proposal.bid_amount | currency }}</td>
            <td>{{ proposal.created_at | date }}</td>
            <td>
              <p-tag
                [value]="proposal.is_accepted ? 'Accepted' : 'Pending'"
                [severity]="proposal.is_accepted ? 'success' : 'info'">
              </p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  pButton
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text"
                  (click)="viewProposal(proposal)"
                  pTooltip="View Details">
                </button>
                <button
                  *ngIf="!proposal.is_accepted && job?.is_open"
                  pButton
                  icon="pi pi-check"
                  class="p-button-rounded p-button-text p-button-success"
                  (click)="confirmAccept(proposal)"
                  pTooltip="Accept Proposal">
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="5" class="text-center p-4">
              No proposals found for this job.
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- View Proposal Dialog -->
      <p-dialog
        [(visible)]="showDialog"
        [header]="'Proposal Details'"
        [modal]="true"
        [style]="{width: '50vw'}"
        [draggable]="false"
        [resizable]="false">

        <div *ngIf="selectedProposal" class="proposal-details">
          <!-- Freelancer Info -->
          <div class="mb-4">
            <h3>Freelancer</h3>
            <div class="flex align-items-center gap-3">
              <p-avatar
                [image]="selectedProposal.freelancer?.profile_picture"
                shape="circle"
                size="large">
              </p-avatar>
              <div>
                <h4 class="m-0">{{ selectedProposal.freelancer?.username }}</h4>
                <p class="text-500 m-0" *ngIf="selectedProposal.freelancer">Member since {{ selectedProposal.freelancer.created_at | date:'mediumDate' }}</p>
              </div>
            </div>
          </div>

          <!-- Bid Details -->
          <div class="mb-4">
            <h3>Bid Details</h3>
            <div class="grid">
              <div class="col-6">
                <label class="block font-bold mb-2">Bid Amount</label>
                <span class="text-2xl">{{ selectedProposal.bid_amount | currency }}</span>
              </div>
              <div class="col-6">
                <label class="block font-bold mb-2">Submitted</label>
                <span>{{ selectedProposal.created_at | date:'medium' }}</span>
              </div>
            </div>
          </div>

          <!-- Cover Letter -->
          <div class="mb-4">
            <h3>Cover Letter</h3>
            <p [innerHTML]="selectedProposal.cover_letter | nl2br"></p>
          </div>

          <!-- Attachments -->
<!--          <div *ngIf="selectedProposal.attachments?.length">-->
<!--            <h3>Attachments</h3>-->
<!--            <div class="flex flex-wrap gap-2">-->
<!--              <a-->
<!--                *ngFor="let attachment of selectedProposal.attachments"-->
<!--                [href]="attachment"-->
<!--                target="_blank"-->
<!--                class="p-button p-button-text">-->
<!--                <i class="pi pi-download"></i>-->
<!--                {{ getFileName(attachment) }}-->
<!--              </a>-->
<!--            </div>-->
<!--          </div>-->
        </div>

        <ng-template pTemplate="footer">
          <button
            pButton
            type="button"
            label="Close"
            class="p-button-text"
            (click)="showDialog = false">
          </button>
          <button
            *ngIf="selectedProposal && !selectedProposal.is_accepted && job?.is_open"
            pButton
            type="button"
            label="Accept Proposal"
            class="p-button-success"
            [loading]="loading"
            (click)="confirmAccept(selectedProposal)">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Confirmation Dialog -->
      <p-confirmDialog
        header="Accept Proposal"
        icon="pi pi-exclamation-triangle"
        acceptButtonStyleClass="p-button-success"
        rejectButtonStyleClass="p-button-text">
      </p-confirmDialog>
    </div>
  `,
  styles: [`
    .proposal-details {
      max-height: 70vh;
      overflow-y: auto;
      padding-right: 1rem;
    }
  `]
})
export class JobProposalsComponent implements OnInit {
  jobId!: number;
  job: Job | null = null;
  proposals: Proposal[] = [];
  loading = false;
  totalRecords = 0;
  showDialog = false;
  selectedProposal: Proposal | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private proposalService: ProposalService,
    private contractService: ContractService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.jobId = this.route.snapshot.params['id'];
    if (!this.jobId) {
      this.router.navigate(['/dashboard/jobs']);
      return;
    }

    this.loadJob();
    this.loadProposals();
  }

  loadJob() {
    this.jobService.getJob(this.jobId).subscribe({
      next: (job) => {
        this.job = job;
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

  loadProposals(page = 1) {
    this.loading = true;
    this.proposalService.getJobProposals(this.jobId).subscribe({
      next: (response) => {
        this.proposals = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading proposals:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load proposals'
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.loadProposals(event.page + 1);
  }

  viewProposal(proposal: Proposal) {
    this.selectedProposal = proposal;
    this.showDialog = true;
  }

  confirmAccept(proposal: Proposal) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to accept this proposal? This will create a contract and close the job.',
      accept: () => {
        this.acceptProposal(proposal);
      }
    });
  }

  acceptProposal(proposal: Proposal) {
    if (!this.job?.is_open) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'This job is no longer accepting proposals'
      });
      return;
    }

    this.loading = true;
    this.proposalService.acceptProposal(proposal.id).subscribe({
      next: () => {
        // Create contract
        const contractData = {
          proposal: proposal.id,
          start_date: new Date().toISOString(),
          total_payment: proposal.bid_amount
        };

        this.contractService.createContract(contractData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Proposal accepted and contract created successfully'
            });
            this.loading = false;
            this.showDialog = false;
            this.loadJob();
            this.loadProposals();
          },
          error: (error) => {
            console.error('Error creating contract:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create contract. Please try again.'
            });
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error accepting proposal:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to accept proposal. Please try again.'
        });
        this.loading = false;
      }
    });
  }

  getFileName(path: string): string {
    return path.split('/').pop() || path;
  }
}
