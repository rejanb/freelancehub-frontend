import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContractService } from '../../../../../service/contract.service';
import { MilestoneService } from '../../../../../service/milestone.service';
import { TokenService } from '../../../../utils/token.service';
import { Contract, Milestone } from '../../../../model/models';
import { RoleConst } from '../../../../const/api-const';
import { Nl2brPipe } from '../../../../pipes/nl2br.pipe';

interface ErrorResponse {
  error: string;
  message: string;
}

@Component({
  selector: 'app-milestone-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    TagModule,
    TimelineModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    CalendarModule,
    ConfirmDialogModule,
    Nl2brPipe
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card" *ngIf="contract">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Contract Milestones</h2>
          <p class="text-500 mt-2 mb-0">
            {{ contract.proposal?.job?.title }}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            pButton
            icon="pi pi-arrow-left"
            label="Back to Contract"
            class="p-button-text"
            [routerLink]="['/dashboard/contracts', contract.id]">
          </button>
          <button
            *ngIf="isClient && contract.status === 'active'"
            pButton
            icon="pi pi-plus"
            label="Add Milestone"
            (click)="showAddDialog()">
          </button>
        </div>
      </div>

      <!-- Milestones Timeline -->
      <p-timeline
        [value]="milestones"
        align="alternate"
        styleClass="mt-4">
        <ng-template pTemplate="marker" let-milestone>
          <span
            class="custom-marker shadow-2"
            [style.backgroundColor]="getStatusColor(milestone.status)">
            <i [class]="getStatusIcon(milestone.status)"></i>
          </span>
        </ng-template>

        <ng-template pTemplate="content" let-milestone>
          <p-card [style]="{maxWidth: '450px'}">
            <div class="flex justify-content-between align-items-center mb-3">
              <h3 class="m-0">{{ milestone.title }}</h3>
              <p-tag
                [value]="milestone.status"
                [severity]="getStatusSeverity(milestone.status)">
              </p-tag>
            </div>

            <p [innerHTML]="milestone.description | nl2br"></p>

            <div class="grid">
              <div class="col-12 md:col-6">
                <label class="block font-bold mb-2">Amount</label>
                <span class="text-xl">{{ milestone.amount | currency }}</span>
              </div>
              <div class="col-12 md:col-6">
                <label class="block font-bold mb-2">Due Date</label>
                <span>{{ milestone.due_date | date:'mediumDate' }}</span>
              </div>
            </div>

            <div class="flex justify-content-end gap-2 mt-4">
              <button
                *ngIf="isClient && milestone.status === 'pending'"
                pButton
                icon="pi pi-play"
                label="Start"
                class="p-button-success"
                (click)="startMilestone(milestone)">
              </button>
              <button
                *ngIf="isClient && milestone.status === 'in_progress'"
                pButton
                icon="pi pi-check"
                label="Complete"
                class="p-button-success"
                (click)="completeMilestone(milestone)">
              </button>
              <button
                *ngIf="isClient && milestone.status === 'completed'"
                pButton
                icon="pi pi-dollar"
                label="Release Payment"
                class="p-button-success"
                (click)="releaseMilestonePayment(milestone)">
              </button>
            </div>
          </p-card>
        </ng-template>
      </p-timeline>

      <!-- Add/Edit Milestone Dialog -->
      <p-dialog
        [(visible)]="showDialog"
        [header]="editingMilestone ? 'Edit Milestone' : 'Add Milestone'"
        [modal]="true"
        [style]="{width: '500px'}"
        [draggable]="false"
        [resizable]="false">

        <form [formGroup]="milestoneForm" class="p-fluid">
          <div class="field">
            <label for="title">Title</label>
            <input
              id="title"
              type="text"
              pInputText
              formControlName="title"
              [class.ng-invalid]="milestoneForm.get('title')?.invalid && milestoneForm.get('title')?.touched">
            <small
              class="p-error"
              *ngIf="milestoneForm.get('title')?.invalid && milestoneForm.get('title')?.touched">
              Title is required
            </small>
          </div>

          <div class="field">
            <label for="description">Description</label>
            <textarea
              id="description"
              pInputTextarea
              formControlName="description"
              [rows]="3"
              [autoResize]="true"
              [class.ng-invalid]="milestoneForm.get('description')?.invalid && milestoneForm.get('description')?.touched">
            </textarea>
            <small
              class="p-error"
              *ngIf="milestoneForm.get('description')?.invalid && milestoneForm.get('description')?.touched">
              Description is required
            </small>
          </div>

          <div class="field">
            <label for="amount">Amount</label>
            <p-inputNumber
              id="amount"
              formControlName="amount"
              [min]="0"
              [mode]="'currency'"
              [currency]="'USD'"
              [class.ng-invalid]="milestoneForm.get('amount')?.invalid && milestoneForm.get('amount')?.touched">
            </p-inputNumber>
            <small
              class="p-error"
              *ngIf="milestoneForm.get('amount')?.invalid && milestoneForm.get('amount')?.touched">
              Amount is required and must be greater than 0
            </small>
          </div>

          <div class="field">
            <label for="due_date">Due Date</label>
            <p-calendar
              id="due_date"
              formControlName="due_date"
              [showTime]="true"
              [minDate]="minDate"
              [class.ng-invalid]="milestoneForm.get('due_date')?.invalid && milestoneForm.get('due_date')?.touched">
            </p-calendar>
            <small
              class="p-error"
              *ngIf="milestoneForm.get('due_date')?.invalid && milestoneForm.get('due_date')?.touched">
              Due date is required and must be in the future
            </small>
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
            [label]="editingMilestone ? 'Update' : 'Add'"
            [loading]="loading"
            [disabled]="milestoneForm.invalid || loading"
            (click)="saveMilestone()">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Confirmation Dialog -->
      <p-confirmDialog
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        acceptButtonStyleClass="p-button-success"
        rejectButtonStyleClass="p-button-text">
      </p-confirmDialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .custom-marker {
        display: flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        z-index: 1;
      }

      .custom-marker i {
        color: #ffffff;
      }

      .p-timeline-event-content,
      .p-timeline-event-opposite {
        line-height: 1;
      }
    }
  `]
})
export class MilestoneListComponent implements OnInit {
  // contract: Contract | null = null;
  milestones: Milestone[] = [];
  contract: any | null = null;
  loading = false;
  isClient = false;
  showDialog = false;
  editingMilestone: Milestone | null = null;
  minDate = new Date();

  milestoneForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private milestoneService: MilestoneService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.milestoneForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      due_date: [null, [Validators.required, this.futureDateValidator()]]
    });
  }

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;

    const contractId = this.route.snapshot.params['id'];
    if (!contractId) {
      this.router.navigate(['/dashboard/contracts']);
      return;
    }

    this.loadContract(contractId);
    this.loadMilestones(contractId);
  }

  loadContract(id: number) {
    this.loading = true;
    this.contractService.getContract(id).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.loading = false;
      },
      error: (error: ErrorResponse) => {
        console.error('Error loading contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load contract details'
        });
        this.router.navigate(['/dashboard/contracts']);
      }
    });
  }

  loadMilestones(contractId: number) {
    this.loading = true;
    this.milestoneService.getContractMilestones(contractId).subscribe({
      next: (milestones: Milestone[]) => {
        this.milestones = milestones;
        this.loading = false;
      },
      error: (error: ErrorResponse) => {
        console.error('Error loading milestones:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load milestones'
        });
        this.loading = false;
      }
    });
  }

  showAddDialog() {
    this.editingMilestone = null;
    this.milestoneForm.reset();
    this.showDialog = true;
  }

  showEditDialog(milestone: Milestone) {
    this.editingMilestone = milestone;
    this.milestoneForm.patchValue({
      title: milestone.title,
      description: milestone.description,
      amount: milestone.amount,
      due_date: new Date(milestone.due_date)
    });
    this.showDialog = true;
  }

  saveMilestone() {
    if (!this.contract || !this.milestoneForm.valid) return;

    this.loading = true;
    const formData = {
      ...this.milestoneForm.value,
      due_date: this.milestoneForm.value.due_date.toISOString()
    };

    const request$ = this.editingMilestone
      ? this.milestoneService.updateMilestone(this.contract.id, this.editingMilestone.id, formData)
      : this.milestoneService.createMilestone(this.contract.id, formData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Milestone ${this.editingMilestone ? 'updated' : 'created'} successfully`
        });
        this.loading = false;
        this.showDialog = false;
        this.loadMilestones(this.contract!.id);
      },
      error: (error: ErrorResponse) => {
        console.error('Error saving milestone:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.editingMilestone ? 'update' : 'create'} milestone`
        });
        this.loading = false;
      }
    });
  }

  startMilestone(milestone: Milestone) {
    if (!this.contract) return;

    this.loading = true;
    this.milestoneService.updateMilestoneStatus(
      this.contract.id,
      milestone.id,
      'in_progress'
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Milestone started successfully'
        });
        this.loading = false;
        this.loadMilestones(this.contract!.id);
      },
      error: (error: ErrorResponse) => {
        console.error('Error starting milestone:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to start milestone'
        });
        this.loading = false;
      }
    });
  }

  completeMilestone(milestone: Milestone) {
    if (!this.contract) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to mark this milestone as completed?',
      accept: () => {
        this.loading = true;
        this.milestoneService.completeMilestone(
          this.contract!.id,
          milestone.id
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Milestone completed successfully'
            });
            this.loading = false;
            this.loadMilestones(this.contract!.id);
          },
          error: (error: ErrorResponse) => {
            console.error('Error completing milestone:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to complete milestone'
            });
            this.loading = false;
          }
        });
      }
    });
  }

  releaseMilestonePayment(milestone: Milestone) {
    if (!this.contract) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to release the payment of ${milestone.amount} for this milestone?`,
      accept: () => {
        this.loading = true;
        this.milestoneService.releaseMilestonePayment(
          this.contract!.id,
          milestone.id
        ).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Payment released successfully'
            });
            this.loading = false;
            this.loadMilestones(this.contract!.id);
          },
          error: (error: ErrorResponse) => {
            console.error('Error releasing payment:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to release payment'
            });
            this.loading = false;
          }
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#9C27B0';
      case 'in_progress':
        return '#2196F3';
      case 'completed':
        return '#689F38';
      case 'paid':
        return '#FF9800';
      default:
        return '#607D8B';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'pi pi-clock';
      case 'in_progress':
        return 'pi pi-sync';
      case 'completed':
        return 'pi pi-check';
      case 'paid':
        return 'pi pi-dollar';
      default:
        return 'pi pi-circle';
    }
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'paid':
        return 'success';
      default:
        return 'secondary';
    }
  }

  private futureDateValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      const date = new Date(control.value);
      const now = new Date();
      return date > now ? null : { pastDate: true };
    };
  }
}
