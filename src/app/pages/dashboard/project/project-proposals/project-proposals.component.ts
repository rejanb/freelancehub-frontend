import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectService } from '../../../../../service/project.service';
import { TokenService } from '../../../../../app/utils/token.service';
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-project-proposals',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    TooltipModule,
    ButtonModule,
    TagModule,
    CardModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    InputTextarea,
    InputNumber,
    FormsModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="project-proposals-container">
      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center p-6">
        <p-progressSpinner></p-progressSpinner>
        <p class="mt-3">Loading proposals...</p>
      </div>

      <!-- Content -->
      <div *ngIf="!loading">
        <!-- Header -->
        <div class="flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="text-2xl font-semibold m-0">Project Proposals</h2>
            <p class="text-600 mt-1" *ngIf="project">{{ project.title }}</p>
          </div>
          <div class="flex gap-2">
            <button pButton
                    *ngIf="canApplyToProject()"
                    label="Apply for Project"
                    icon="pi pi-send"
                    class="p-button-success"
                    (click)="showApplyDialog()">
            </button>
            <button pButton
                    label="Back to Projects"
                    icon="pi pi-arrow-left"
                    class="p-button-outlined"
                    routerLink="../">
            </button>
          </div>
        </div>

        <!-- Project Summary -->
        <div class="card mb-4" *ngIf="project">
          <div class="grid">
            <div class="col-12 md:col-8">
              <h3 class="mt-0">{{ project.title }}</h3>
              <p class="text-600 mb-3">{{ project.description }}</p>
              <div class="flex flex-wrap gap-4">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-dollar text-green-600"></i>
                  <span class="font-medium">Budget: \${{ project.budget | number:'1.0-0' }}</span>
                </div>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-calendar text-blue-600"></i>
                  <span class="font-medium">Deadline: {{ project.deadline | date:'mediumDate' }}</span>
                </div>
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-tag text-purple-600"></i>
                  <span class="font-medium">{{ project.category?.name }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 md:col-4 text-right">
              <p-tag [value]="project.status" [severity]="getStatusSeverity(project.status)" class="text-base"></p-tag>
              <div class="mt-2">
                <span class="font-bold text-2xl">{{ proposals.length }}</span>
                <span class="text-600 ml-1">proposals received</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Proposals -->
        <div class="card">
          <h3>Proposals</h3>

          <div *ngIf="proposals.length === 0" class="text-center py-6">
            <i class="pi pi-inbox text-4xl text-400 mb-3"></i>
            <p class="text-lg text-600">No proposals yet</p>
            <p class="text-sm text-500">Proposals will appear here as freelancers apply for your project.</p>
          </div>

          <div *ngIf="proposals.length > 0">
            <p-table [value]="proposals" responsiveLayout="scroll">
              <ng-template pTemplate="header">
                <tr>
                  <th>Freelancer</th>
                  <th>Proposed Budget</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </ng-template>

              <ng-template pTemplate="body" let-proposal>
                <tr [ngClass]="{'bg-blue-50': proposal.freelancer?.id === currentUserId}">
                  <td>
                    <div class="flex align-items-center gap-3">
                      <div class="flex align-items-center justify-content-center bg-blue-100 text-blue-800 border-round"
                           style="width: 2.5rem; height: 2.5rem;">
                        {{ proposal.freelancer.username.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="font-medium">
                          {{ proposal.freelancer.username }}
                          <span *ngIf="proposal.freelancer?.id === currentUserId" class="text-sm text-blue-600 ml-2">(Your proposal)</span>
                        </div>
                        <div class="text-600 text-sm">{{ proposal.freelancer.email }}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span class="font-bold text-green-600">\${{ proposal.proposed_budget | number:'1.0-0' }}</span>
                  </td>

                  <td>
                    <span *ngIf="proposal.proposed_timeline">{{ proposal.proposed_timeline }}</span>
                    <span *ngIf="!proposal.proposed_timeline" class="text-400">Not specified</span>
                  </td>

                  <td>
                    <p-tag [value]="proposal.status" [severity]="getProposalStatusSeverity(proposal.status)"></p-tag>
                  </td>

                  <td>
                    {{ proposal.created_at | date:'mediumDate' }}
                  </td>

                  <td>
                    <div class="flex gap-1">
                      <!-- View Cover Letter -->
                      <button pButton
                                icon="pi pi-file"
                              class="p-button-rounded p-button-outlined p-button-sm"
                              (click)="viewCoverLetter(proposal)"
                              pTooltip="View More Information">
                      </button>

                      <!-- Accept Proposal -->
                      <button pButton
                              icon="pi pi-check"
                              class="p-button-rounded p-button-success p-button-sm"
                              *ngIf="proposal.status === 'pending' && canManageProposals()"
                              (click)="acceptProposal(proposal)"
                              pTooltip="Accept Proposal">
                      </button>

                      <!-- Reject Proposal -->
                      <button pButton
                              icon="pi pi-times"
                              class="p-button-rounded p-button-danger p-button-sm"
                              *ngIf="proposal.status === 'pending' && canManageProposals()"
                              (click)="rejectProposal(proposal)"
                              pTooltip="Reject Proposal">
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>

      <!-- Cover Letter Dialog -->
      <p-dialog header="Cover Letter"
                [(visible)]="showCoverLetterDialog"
                [modal]="true"
                [style]="{ width: '600px' }"
                [draggable]="false"
                [resizable]="false">
        <div *ngIf="selectedProposal">
          <div class="mb-3">
            <h4 class="mt-0">{{ selectedProposal.freelancer.username }}</h4>
            <div class="flex gap-4 text-sm text-600">
              <span>Proposed Budget: <strong>\${{ selectedProposal.proposed_budget }}</strong></span>
              <span *ngIf="selectedProposal.estimated_timeline">Timeline: <strong>{{ selectedProposal.estimated_timeline }}</strong></span>
            </div>
          </div>

          <div class="mb-3">
            <h5>Cover Letter</h5>
            <div class="bg-gray-50 p-3 border-round">
              <p class="white-space-pre-line m-0">{{ selectedProposal.cover_letter }}</p>
            </div>
          </div>

          <div class="flex gap-2 justify-content-end">
            <button pButton
                    label="Close"
                    class="p-button-outlined"
                    (click)="closeCoverLetterDialog()">
            </button>
            <button pButton
                    label="Accept Proposal"
                    *ngIf="selectedProposal.status === 'pending' && canManageProposals()"
                    (click)="acceptProposal(selectedProposal); closeCoverLetterDialog()">
            </button>
          </div>
        </div>
      </p-dialog>

      <!-- Apply Dialog -->
      <p-dialog header="Apply for Project"
                [(visible)]="showApplyFormDialog"
                [modal]="true"
                [style]="{ width: '600px' }"
                [draggable]="false"
                [resizable]="false">
        <div class="flex flex-column gap-4">
          <div class="field">
            <label for="proposedBudget" class="block font-medium mb-2">Proposed Budget (\$)</label>
            <p-inputNumber
              id="proposedBudget"
              [(ngModel)]="proposalForm.proposedBudget"
              mode="currency"
              currency="USD"
              class="w-full"
              [min]="1"
              placeholder="Enter your proposed budget">
            </p-inputNumber>
          </div>

          <div class="field">
            <label for="timeline" class="block  mb-2">Estimated Timeline</label>
            <input
              id="timeline"
              type="text"
              pInputText
              [(ngModel)]="proposalForm.timeline"
              placeholder="e.g., 2 weeks, 1 month"
              class="w-full">
          </div>

          <div class="field">
            <label for="coverLetter" class="block font-medium mb-2">Cover Letter</label>
            <textarea
              id="coverLetter"
              pInputTextarea
              [(ngModel)]="proposalForm.coverLetter"
              rows="6"
              class="w-full"
              placeholder="Explain why you're the best fit for this project...">
            </textarea>
          </div>

          <div class="flex gap-2 justify-content-end">
            <button pButton
                    label="Cancel"
                    class="p-button-outlined"
                    (click)="closeApplyDialog()">
            </button>
            <button pButton
                    label="Submit Proposal"
                    class="p-button-success"
                    [disabled]="!isProposalFormValid()"
                    (click)="submitProposal()">
            </button>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-table .p-table-tbody > tr > td {
      padding: 1rem 0.75rem;
      vertical-align: top;
    }

    .white-space-pre-line {
      white-space: pre-line;
    }
  `]
})
export class ProjectProposalsComponent implements OnInit {
  projectId: string = '';
  project: any = null;
  proposals: any[] = [];
  loading = true;
  userRole: string = '';
  currentUserId: number | null = null;

  showCoverLetterDialog = false;
  selectedProposal: any = null;

  showApplyFormDialog = false;
  proposalForm = {
    proposedBudget: null,
    timeline: '',
    coverLetter: ''
  };

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.userRole = this.tokenService.getUserRole();
    this.currentUserId = this.tokenService.getUserId();

    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.loadProjectAndProposals();
    });
  }

  loadProjectAndProposals() {
    this.loading = true;

    // Load project details
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        this.project = project;

        // Load proposals - but handle permission error for freelancers
        this.projectService.getProjectProposals(this.projectId).subscribe({
          next: (response) => {
            // Handle paginated response
            if (response.results) {
              this.proposals = response.results;
            } else {
              this.proposals = response;
            }
            this.loading = false;
          },
          error: (error) => {
            // console.error('Error loading proposals:', error);

            // If it's a permission error and user is a freelancer, that's expected
            if (error.status === 403 && this.userRole === 'freelancer') {
              console.log('Freelancer cannot view proposals - this is normal');
              this.proposals = []; // Set empty array
              this.loading = false;
            } else {
              // this.messageService.add({
              //   severity: 'error',
              //   summary: 'Error',
              //   detail: 'Failed to load proposals'
              // });
              this.loading = false;
            }
          }
        });
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load project details'
        });
        this.loading = false;
      }
    });
  }

  canManageProposals(): boolean {
    if (this.userRole === 'admin') return true;
    if (this.userRole === 'client') return true;
    return false;
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

  getProposalStatusSeverity(status: string): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    switch (status) {
      case 'pending': return 'warn';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'withdrawn': return 'secondary';
      default: return 'info';
    }
  }

  canApplyToProject(): boolean {
    // Freelancers can apply if:
    // 1. User is a freelancer
    // 2. Project is open
    // 3. User is not the project owner
    // 4. Project has no assigned freelancer
    // Note: We can't reliably check if user already applied since freelancers may not have permission to view proposals
    if (this.userRole !== 'freelancer' || !this.project) return false;
    if (this.project.status !== 'open') return false;
    if (this.project.client?.id === this.currentUserId) return false;
    if (this.project.selected_freelancer) return false;

    return true;
  }

  showApplyDialog() {
    this.proposalForm = {
      proposedBudget: null,
      timeline: '',
      coverLetter: ''
    };
    this.showApplyFormDialog = true;
  }

  closeApplyDialog() {
    this.showApplyFormDialog = false;
  }

  isProposalFormValid(): boolean {
    return !!(this.proposalForm.proposedBudget &&
              this.proposalForm.coverLetter &&
              this.proposalForm.coverLetter.trim().length > 0);
  }

  submitProposal() {
    if (!this.isProposalFormValid()) return;

    const proposalData = {
      project: this.projectId,
      proposed_budget: this.proposalForm.proposedBudget,
      proposed_timeline: this.proposalForm.timeline,
      cover_letter: this.proposalForm.coverLetter
    };

    this.projectService.applyForProject(this.projectId, proposalData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your proposal has been submitted successfully!'
        });
        this.closeApplyDialog();
        this.loadProjectAndProposals(); // Reload to show the new proposal
      },
      error: (error: any) => {
        console.error('Error submitting proposal:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || 'Failed to submit proposal'
        });
      }
    });
  }

  viewCoverLetter(proposal: any) {
    this.selectedProposal = proposal;
    this.showCoverLetterDialog = true;
  }

  closeCoverLetterDialog() {
    this.showCoverLetterDialog = false;
    this.selectedProposal = null;
  }

  acceptProposal(proposal: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to accept ${proposal.freelancer.username}'s proposal? This will assign them to the project.`,
      header: 'Accept Proposal',
      icon: 'pi pi-check',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.projectService.acceptProposal(proposal.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Proposal accepted successfully!'
            });
            this.loadProjectAndProposals();
          },
          error: (error) => {
            console.error('Error accepting proposal:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.detail || 'Failed to accept proposal'
            });
          }
        });
      }
    });
  }

  rejectProposal(proposal: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reject ${proposal.freelancer.username}'s proposal?`,
      header: 'Reject Proposal',
      icon: 'pi pi-times',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.projectService.rejectProposal(proposal.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Proposal rejected'
            });
            this.loadProjectAndProposals();
          },
          error: (error) => {
            console.error('Error rejecting proposal:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.detail || 'Failed to reject proposal'
            });
          }
        });
      }
    });
  }
}
