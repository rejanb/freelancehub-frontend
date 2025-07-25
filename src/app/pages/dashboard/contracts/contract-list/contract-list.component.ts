import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ContractService, ContractFilters } from '../../../../../service/contract.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';
import { Contract } from '../../../../model/models';
import {DatePickerModule} from 'primeng/datepicker';

interface ContractListFilters {
  search: string;
  status: 'active' | 'completed' | 'cancelled' | null;
  dateRange: Date[] | null;
  sort: string | null;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    TableModule,
    CardModule,
    TagModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    IconField,
    InputIcon,
    DatePickerModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="card">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{{ isClient ? 'My Contracts (Client)' : 'My Contracts (Freelancer)' }}</h2>
          <p class="text-muted m-0">
            {{ isClient ? 'Manage contracts with your freelancers' : 'View and manage your work contracts' }}
          </p>
        </div>
        <div class="flex gap-2">
          <p-iconfield styleClass="w-full" iconPosition="left">
            <p-inputicon>
              <i class="pi pi-search"></i>
            </p-inputicon>
            <input
              type="text"
              pInputText
              [(ngModel)]="filters.search"
              (input)="onSearch()"
              placeholder="Search contracts..."
              class="w-full">
          </p-iconfield>
        </div>
      </div>

      <!-- Filters -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="statusOptions"
            [(ngModel)]="filters.status"
            (onChange)="loadContracts()"
            placeholder="Status"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>

        <div class="col-12 md:col-3">
          <p-datepicker [(ngModel)]="filters.dateRange" placeholder="Normal" showIcon iconDisplay="input" />

        </div>

        <div class="col-12 md:col-3">
          <p-dropdown
            [options]="sortOptions"
            [(ngModel)]="filters.sort"
            (onChange)="loadContracts()"
            placeholder="Sort by"
            [showClear]="true"
            class="w-full">
          </p-dropdown>
        </div>
      </div>

      <!-- Contracts Table -->
      <p-table
        [value]="contracts"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        [totalRecords]="totalRecords"
        [rowsPerPageOptions]="[10, 25, 50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contracts"
        (onPage)="onPageChange($event)">

        <ng-template pTemplate="header">
          <tr>
            <th>Contract ID</th>
            <th>{{ isClient ? 'Freelancer' : 'Client' }}</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-contract>
          <tr>
            <td>
              <a
                [routerLink]="['/dashboard/contracts', contract.id]"
                class="text-primary hover:underline">
                #{{ contract.id }}
              </a>
            </td>
            <td>
              {{ isClient ? contract.freelancer?.username : contract.client?.username }}
            </td>
            <td>{{ contract.proposal?.job?.title || contract.project_proposal?.project?.title || 'N/A' }}</td>
            <td>{{ contract.total_payment | currency }}</td>
            <td>{{ contract.start_date | date }}</td>
            <td>
              <p-tag
                [value]="contract.status"
                [severity]="getStatusSeverity(contract.status)">
              </p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <!-- Common actions for both client and freelancer -->
                <button
                  pButton
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-text"
                  [routerLink]="['/dashboard/contracts', contract.id]"
                  pTooltip="View Details">
                </button>
                <button
                  pButton
                  icon="pi pi-list"
                  class="p-button-rounded p-button-text"
                  [routerLink]="['/dashboard/contracts', contract.id, 'milestones']"
                  pTooltip="View Milestones">
                </button>
                <button
                  pButton
                  icon="pi pi-download"
                  class="p-button-rounded p-button-text p-button-info"
                  (click)="downloadPDF(contract)"
                  pTooltip="Download Contract PDF">
                </button>

                <!-- Client-only actions -->
                <ng-container *ngIf="isClient">
                  <!-- Cancel contract (only for active contracts) -->
                  <button
                    *ngIf="contract.status === 'active'"
                    pButton
                    icon="pi pi-times"
                    class="p-button-rounded p-button-text p-button-danger"
                    (click)="cancelContract(contract)"
                    pTooltip="Cancel Contract (Client Action)"
                    tooltipPosition="top">
                  </button>

                  <!-- Extend contract deadline (only for active contracts) -->
                  <button
                    *ngIf="contract.status === 'active'"
                    pButton
                    icon="pi pi-calendar-plus"
                    class="p-button-rounded p-button-text p-button-warning"
                    (click)="extendContract(contract)"
                    pTooltip="Extend Deadline (Client Action)"
                    tooltipPosition="top">
                  </button>
                </ng-container>

                <!-- Freelancer-only actions -->
                <ng-container *ngIf="!isClient">
                  <!-- Mark contract as complete (only for active contracts) -->
                  <button
                    *ngIf="contract.status === 'active'"
                    pButton
                    icon="pi pi-check"
                    class="p-button-rounded p-button-text p-button-success"
                    (click)="completeContract(contract)"
                    pTooltip="Mark as Complete (Freelancer Action)"
                    tooltipPosition="top">
                  </button>
                </ng-container>

                <!-- Upload documents (for active contracts only) -->
                <button
                  *ngIf="contract.status === 'active'"
                  pButton
                  icon="pi pi-upload"
                  class="p-button-rounded p-button-text"
                  (click)="uploadDocument(contract)"
                  pTooltip="Upload Document">
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center p-4">
              No contracts found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Confirmation Dialog -->
    <p-confirmDialog></p-confirmDialog>

    <!-- Extend Contract Dialog -->
    <p-dialog
      header="Extend Contract Deadline"
      [(visible)]="showExtendDialog"
      [modal]="true"
      [style]="{width: '400px'}"
      [closable]="true">

      <div class="mb-3">
        <p>Current end date: {{ selectedContract?.end_date | date }}</p>
        <p class="text-muted">Select a new end date for the contract.</p>
      </div>

      <div class="mb-3">
        <label for="newEndDate" class="block mb-2">New End Date</label>
        <p-calendar
          id="newEndDate"
          [(ngModel)]="newEndDate"
          [minDate]="getMinExtendDate()"
          [showIcon]="true"
          placeholder="Select new end date"
          class="w-full">
        </p-calendar>
      </div>

      <ng-template pTemplate="footer">
        <button
          pButton
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          (click)="cancelExtendDialog()">
        </button>
        <button
          pButton
          label="Extend"
          icon="pi pi-check"
          [disabled]="!newEndDate"
          (click)="confirmExtendContract()">
        </button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep {
      .p-dropdown {
        width: 100%;
      }
      .p-calendar {
        width: 100%;
      }
      .p-button-danger {
        color: #e24c4c;
      }
      .p-button-danger:hover {
        background-color: #e24c4c;
        color: white;
      }
      .p-button-success {
        color: #22c55e;
      }
      .p-button-success:hover {
        background-color: #22c55e;
        color: white;
      }
      .p-button-warning {
        color: #f59e0b;
      }
      .p-button-warning:hover {
        background-color: #f59e0b;
        color: white;
      }
    }
  `]
})
export class ContractListComponent implements OnInit, OnDestroy {
  contracts: Contract[] = [];
  loading = false;
  totalRecords = 0;
  isClient = false;
  private queryParamsSubscription: Subscription = new Subscription();

  // Dialog states
  showExtendDialog = false;
  selectedContract: Contract | null = null;
  newEndDate: Date | null = null;

  filters: ContractListFilters = {
    search: '',
    status: null,
    dateRange: null,
    sort: null,
    page: 1,
    pageSize: 10
  };

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Amount: High to Low', value: '-total_payment' },
    { label: 'Amount: Low to High', value: 'total_payment' }
  ];

  constructor(
    private contractService: ContractService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;

    // Subscribe to query parameter changes
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params['status']) {
        this.filters.status = params['status'];
      } else {
        this.filters.status = null;
      }
      this.loadContracts();
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

  loadContracts(page = 1) {
    // --- STATIC DATA FOR CONTRACT TABLE DEMO ---
    this.loading = true;
    setTimeout(() => {
      this.contracts = [
        {
          id: 101,
          freelancer: { id: 1, username: 'freelancer1', email: 'freelancer1@example.com', user_type: 'freelancer' },
          client: { id: 11, username: 'client1', email: 'client1@example.com', user_type: 'client' },
          proposal: { job: { title: 'Website Redesign' } },
          project_proposal: null,
          total_payment: 1200,
          start_date: '2025-07-01T10:00:00Z',
          status: 'active',
          created_at: '2025-07-01T09:00:00Z',
          updated_at: '2025-07-01T10:00:00Z'
        },
        {
          id: 102,
          freelancer: { id: 2, username: 'freelancer2', email: 'freelancer2@example.com', user_type: 'freelancer' },
          client: { id: 12, username: 'client2', email: 'client2@example.com', user_type: 'client' },
          proposal: null,
          project_proposal: { project: { title: 'Mobile App Launch' } },
          total_payment: 3000,
          start_date: '2025-06-15T09:00:00Z',
          status: 'completed',
          created_at: '2025-06-10T09:00:00Z',
          updated_at: '2025-06-15T09:00:00Z'
        },
        {
          id: 103,
          freelancer: { id: 3, username: 'freelancer3', email: 'freelancer3@example.com', user_type: 'freelancer' },
          client: { id: 13, username: 'client3', email: 'client3@example.com', user_type: 'client' },
          proposal: { job: { title: 'SEO Optimization' } },
          project_proposal: null,
          total_payment: 800,
          start_date: '2025-07-10T12:00:00Z',
          status: 'cancelled',
          created_at: '2025-07-05T12:00:00Z',
          updated_at: '2025-07-10T12:00:00Z'
        }
      ];
      this.totalRecords = this.contracts.length;
      this.loading = false;
    }, 500);
    // --- END STATIC DATA BLOCK ---
  }

  onSearch() {
    // Debounce search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.filters.page = 1;
      this.loadContracts();
    }, 300);
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.pageSize = event.rows;
    this.loadContracts();
  }

  onDateSelect() {
    this.filters.page = 1;
    this.loadContracts();
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

  /**
   * Cancel contract (Client only)
   */
  cancelContract(contract: Contract) {
    this.confirmationService.confirm({
      message: `Are you sure you want to cancel contract #${contract.id}? This action cannot be undone.`,
      header: 'Cancel Contract',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.contractService.cancelContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Contract cancelled successfully'
            });
            this.loadContracts();
          },
          error: (error) => {
            console.error('Error cancelling contract:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to cancel contract'
            });
          }
        });
      }
    });
  }

  /**
   * Complete contract (Freelancer only)
   */
  completeContract(contract: Contract) {
    this.confirmationService.confirm({
      message: `Are you sure you want to mark contract #${contract.id} as completed?`,
      header: 'Complete Contract',
      icon: 'pi pi-check-circle',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.contractService.completeContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Contract marked as completed'
            });
            this.loadContracts();
          },
          error: (error) => {
            console.error('Error completing contract:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to complete contract'
            });
          }
        });
      }
    });
  }

  /**
   * Extend contract deadline (Client only)
   */
  extendContract(contract: Contract) {
    this.selectedContract = contract;
    this.newEndDate = null;
    this.showExtendDialog = true;
  }

  /**
   * Get minimum date for contract extension (current end date + 1 day)
   */
  getMinExtendDate(): Date {
    if (!this.selectedContract?.end_date) {
      return new Date();
    }
    const currentEndDate = new Date(this.selectedContract.end_date);
    currentEndDate.setDate(currentEndDate.getDate() + 1);
    return currentEndDate;
  }

  /**
   * Cancel extend dialog
   */
  cancelExtendDialog() {
    this.showExtendDialog = false;
    this.selectedContract = null;
    this.newEndDate = null;
  }

  /**
   * Confirm contract extension
   */
  confirmExtendContract() {
    if (!this.selectedContract || !this.newEndDate) {
      return;
    }

    const newEndDateStr = this.newEndDate.toISOString().split('T')[0];

    this.contractService.extendContract(this.selectedContract.id, newEndDateStr).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Contract deadline extended successfully'
        });
        this.loadContracts();
        this.cancelExtendDialog();
      },
      error: (error) => {
        console.error('Error extending contract:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to extend contract deadline'
        });
      }
    });
  }

  /**
   * Upload document for contract
   */
  uploadDocument(contract: Contract) {
    // This could open a file upload dialog
    // For now, we'll just show a placeholder message
    this.messageService.add({
      severity: 'info',
      summary: 'Feature Coming Soon',
      detail: 'Document upload feature is coming soon'
    });
  }

  /**
   * Download contract PDF
   */
  downloadPDF(contract: Contract) {
    this.messageService.add({
      severity: 'info',
      summary: 'Generating PDF',
      detail: 'Your contract PDF is being generated...'
    });

    const filename = `contract-${contract.id}-${contract.proposal?.job?.title || 'contract'}.pdf`;
    this.contractService.downloadPDF(contract.id, filename);
  }

  private searchTimeout: any;
}
