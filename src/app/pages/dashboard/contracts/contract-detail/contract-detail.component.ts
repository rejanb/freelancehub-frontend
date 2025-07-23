import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { DialogModule } from 'primeng/dialog';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContractService } from '../../../../../service/contract.service';
import { ChatInitiationService } from '../../../../../service/chat-initiation.service';
import { TokenService } from '../../../../utils/token.service';
import { Contract } from '../../../../model/models';
import { RoleConst } from '../../../../const/api-const';
import { Nl2brPipe } from '../../../../pipes/nl2br.pipe';

@Component({
  selector: 'app-contract-detail',
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
    InputTextarea,
    CalendarModule,
    FileUploadModule,
    ConfirmDialogModule,
    Nl2brPipe
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="card" *ngIf="contract">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Contract #{{ contract.id }}</h2>
          <p class="text-500 mt-2 mb-0">
            {{ contract.proposal?.job?.title }}
          </p>
        </div>
        <div class="flex gap-2">
          <p-tag
            [value]="contract.status"
            [severity]="getStatusSeverity(contract.status)">
          </p-tag>
          <button
            pButton
            icon="pi pi-comments"
            [label]="'Chat with ' + (isClient ? 'Freelancer' : 'Client')"
            class="p-button-info"
            (click)="chatWithContractParty()">
          </button>
          <button
            *ngIf="contract.status === 'active'"
            pButton
            icon="pi pi-check"
            label="Complete Contract"
            class="p-button-success"
            (click)="confirmComplete()">
          </button>
          <button
            *ngIf="contract.status === 'active'"
            pButton
            icon="pi pi-times"
            label="Cancel Contract"
            class="p-button-danger"
            (click)="showCancelDialog()">
          </button>
          <button
            *ngIf="contract.status === 'active'"
            pButton
            icon="pi pi-calendar"
            label="Extend Deadline"
            class="p-button-secondary"
            (click)="showExtendDialog()">
          </button>
        </div>
      </div>

      <!-- Contract Details -->
      <div class="grid">
        <div class="col-12 md:col-8">
          <!-- Contract Info -->
          <p-card>
            <div class="grid">
              <div class="col-12 md:col-6">
                <h3>Client</h3>
                <p>{{ contract.client?.username }}</p>
              </div>
              <div class="col-12 md:col-6">
                <h3>Freelancer</h3>
                <p>{{ contract.freelancer?.username }}</p>
              </div>
            </div>

            <div class="mt-4">
              <h3>Project Details</h3>
              <p [innerHTML]="contract.proposal?.job?.description | nl2br"></p>
            </div>

            <div class="mt-4">
              <h3>Deliverables</h3>
              <p [innerHTML]="contract.deliverables | nl2br"></p>
            </div>

            <div class="mt-4" *ngIf="contract.milestones">
              <h3>Milestones</h3>
              <p [innerHTML]="contract.milestones | nl2br"></p>
            </div>
          </p-card>

          <!-- Documents -->
          <p-card class="mt-4">
            <div class="flex justify-content-between align-items-center">
              <h3 class="m-0">Documents</h3>
              <button
                pButton
                icon="pi pi-upload"
                label="Upload Document"
                class="p-button-secondary"
                (click)="showUploadDialog()">
              </button>
            </div>

            <div class="mt-4">
              <div *ngIf="documents.length === 0" class="text-center p-4">
                No documents uploaded yet.
              </div>
              <div *ngFor="let doc of documents" class="flex align-items-center gap-3 p-3 border-bottom-1 surface-border">
                <i class="pi pi-file text-xl"></i>
                <div class="flex-grow-1">
                  <span class="block">{{ doc.name }}</span>
                  <small class="text-500">{{ doc.uploaded_at | date:'medium' }}</small>
                </div>
                <a
                  [href]="doc.url"
                  target="_blank"
                  class="p-button p-button-text">
                  <i class="pi pi-download"></i>
                </a>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-4">
          <!-- Contract Summary -->
          <p-card>
            <div class="mb-4">
              <label class="block font-bold mb-2">Total Payment</label>
              <span class="text-2xl">{{ contract.total_payment | currency }}</span>
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-2">Start Date</label>
              <span>{{ contract.start_date | date:'mediumDate' }}</span>
            </div>

            <div class="mb-4" *ngIf="contract.end_date">
              <label class="block font-bold mb-2">End Date</label>
              <span>{{ contract.end_date | date:'mediumDate' }}</span>
            </div>

            <div class="mb-4">
              <label class="block font-bold mb-2">Created</label>
              <span>{{ contract.created_at | date:'medium' }}</span>
            </div>

            <div *ngIf="contract.updated_at !== contract.created_at">
              <label class="block font-bold mb-2">Last Updated</label>
              <span>{{ contract.updated_at | date:'medium' }}</span>
            </div>
          </p-card>

          <!-- Actions -->
          <p-card class="mt-4">
            <div class="flex flex-column gap-2">
              <button
                pButton
                icon="pi pi-list"
                label="View Milestones"
                class="p-button-secondary"
                [routerLink]="['/dashboard/contracts', contract.id, 'milestones']">
              </button>
              <button
                pButton
                icon="pi pi-dollar"
                label="View Payments"
                class="p-button-secondary"
                [routerLink]="['/dashboard/payments']"
                [queryParams]="{ contract: contract.id }">
              </button>
            </div>
          </p-card>
        </div>
      </div>

      <!-- Cancel Contract Dialog -->
      <p-dialog
        [(visible)]="showCancelContractDialog"
        [header]="'Cancel Contract'"
        [modal]="true"
        [style]="{width: '450px'}"
        [draggable]="false"
        [resizable]="false">

        <form [formGroup]="cancelForm" class="p-fluid">
          <div class="field">
            <label for="reason">Cancellation Reason</label>
            <textarea
              id="reason"
              pInputTextarea
              formControlName="reason"
              [rows]="3"
              [autoResize]="true"
              placeholder="Please explain why you want to cancel this contract...">
            </textarea>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <button
            pButton
            type="button"
            label="Close"
            class="p-button-text"
            (click)="showCancelContractDialog = false">
          </button>
          <button
            pButton
            type="button"
            label="Cancel Contract"
            class="p-button-danger"
            [loading]="loading"
            (click)="cancelContract()">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Extend Deadline Dialog -->
      <p-dialog
        [(visible)]="showExtendContractDialog"
        [header]="'Extend Contract Deadline'"
        [modal]="true"
        [style]="{width: '450px'}"
        [draggable]="false"
        [resizable]="false">

        <form [formGroup]="extendForm" class="p-fluid">
          <div class="field">
            <label for="end_date">New End Date</label>
            <p-calendar
              id="end_date"
              formControlName="end_date"
              [showTime]="true"
              [minDate]="minEndDate"
              [class.ng-invalid]="extendForm.get('end_date')?.invalid && extendForm.get('end_date')?.touched">
            </p-calendar>
            <small
              class="p-error"
              *ngIf="extendForm.get('end_date')?.invalid && extendForm.get('end_date')?.touched">
              End date is required and must be in the future
            </small>
          </div>
        </form>

        <ng-template pTemplate="footer">
          <button
            pButton
            type="button"
            label="Close"
            class="p-button-text"
            (click)="showExtendContractDialog = false">
          </button>
          <button
            pButton
            type="button"
            label="Extend Contract"
            [loading]="loading"
            [disabled]="extendForm.invalid || loading"
            (click)="extendContract()">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Upload Document Dialog -->
      <p-dialog
        [(visible)]="showUploadDocumentDialog"
        [header]="'Upload Document'"
        [modal]="true"
        [style]="{width: '450px'}"
        [draggable]="false"
        [resizable]="false">

        <p-fileUpload
          mode="basic"
          chooseLabel="Choose File"
          [auto]="true"
          accept="image/*,application/pdf"
          [maxFileSize]="5000000"
          (onSelect)="onFileSelect($event)"
          (uploadHandler)="uploadDocument($event)">
        </p-fileUpload>
        <small class="text-500">Max file size: 5MB. Allowed types: Images, PDF</small>

        <ng-template pTemplate="footer">
          <button
            pButton
            type="button"
            label="Close"
            class="p-button-text"
            (click)="showUploadDocumentDialog = false">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Confirmation Dialog -->
      <p-confirmDialog
        header="Complete Contract"
        icon="pi pi-exclamation-triangle"
        acceptButtonStyleClass="p-button-success"
        rejectButtonStyleClass="p-button-text">
      </p-confirmDialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-calendar {
        width: 100%;
      }
    }
  `]
})
export class ContractDetailComponent implements OnInit {
  // contract: Contract | null = null;
  contract: any | null = null;
  loading = false;
  isClient = false;
  documents: any[] = [];
  showCancelContractDialog = false;
  showExtendContractDialog = false;
  showUploadDocumentDialog = false;
  minEndDate = new Date();
  selectedFile: File | null = null;

  cancelForm: FormGroup;
  extendForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private chatInitiationService: ChatInitiationService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.cancelForm = this.fb.group({
      reason: ['', Validators.required]
    });

    this.extendForm = this.fb.group({
      end_date: [null, [Validators.required, this.futureDateValidator()]]
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
    this.loadDocuments(contractId);
  }

  loadContract(id: number) {
    this.loading = true;
    this.contractService.getContract(id).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.loading = false;
      },
      error: (error) => {
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

  loadDocuments(contractId: number) {
    this.contractService.getContractDocuments(contractId).subscribe({
      next: (documents) => {
        this.documents = documents;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
      }
    });
  }

  chatWithContractParty() {
    if (!this.contract) return;

    const otherParty = this.isClient ? this.contract.freelancer : this.contract.client;
    if (otherParty) {
      this.chatInitiationService.chatWithContractParty(
        this.contract.id,
        otherParty.id,
        otherParty.username || `${otherParty.first_name} ${otherParty.last_name}`.trim()
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

  confirmComplete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to complete this contract? This action cannot be undone.',
      accept: () => {
        this.completeContract();
      }
    });
  }

  completeContract() {
    if (!this.contract) return;

    this.loading = true;
    this.contractService.completeContract(this.contract.id).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contract completed successfully'
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error completing contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to complete contract'
        });
        this.loading = false;
      }
    });
  }

  showCancelDialog() {
    this.cancelForm.reset();
    this.showCancelContractDialog = true;
  }

  cancelContract() {
    if (!this.contract || !this.cancelForm.valid) return;

    this.loading = true;
    this.contractService.cancelContract(
      this.contract.id,
      this.cancelForm.value.reason
    ).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contract cancelled successfully'
        });
        this.loading = false;
        this.showCancelContractDialog = false;
      },
      error: (error) => {
        console.error('Error cancelling contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to cancel contract'
        });
        this.loading = false;
      }
    });
  }

  showExtendDialog() {
    this.extendForm.reset();
    this.showExtendContractDialog = true;
  }

  extendContract() {
    if (!this.contract || !this.extendForm.valid) return;

    this.loading = true;
    const newEndDate = this.extendForm.value.end_date.toISOString();

    this.contractService.extendContract(this.contract.id, newEndDate).subscribe({
      next: (contract) => {
        this.contract = contract;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contract deadline extended successfully'
        });
        this.loading = false;
        this.showExtendContractDialog = false;
      },
      error: (error) => {
        console.error('Error extending contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to extend contract deadline'
        });
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.files[0];
  }

  uploadDocument(event: any) {
    if (!this.contract || !this.selectedFile) return;

    this.loading = true;
    this.contractService.uploadContractDocument(
      this.contract.id,
      this.selectedFile
    ).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document uploaded successfully'
        });
        this.loading = false;
        this.showUploadDocumentDialog = false;
        this.selectedFile = null;
        this.loadDocuments(this.contract!.id);
      },
      error: (error) => {
        console.error('Error uploading document:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload document'
        });
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'warning';
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

  showUploadDialog() {

  }
}
