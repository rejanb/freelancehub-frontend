import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../../../service/payment.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    DropdownModule,
    CalendarModule
  ],
  template: `
    <div class="payment-history">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">{{ isClient ? 'Payment History' : 'Earnings History' }}</h2>
          <p class="text-500 mt-1 mb-0">
            {{ isClient ? 'Track all your project payments' : 'View your earnings and withdrawals' }}
          </p>
        </div>
        <button 
          pButton 
          icon="pi pi-arrow-left" 
          label="Back"
          class="p-button-text"
          routerLink="/dashboard/payments">
        </button>
      </div>

      <!-- Filters -->
      <p-card class="mb-4">
        <div class="grid">
          <div class="col-12 md:col-3">
            <label class="block font-medium mb-2">Status</label>
            <p-dropdown
              [(ngModel)]="filters.status"
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Status"
              [showClear]="true"
              (onChange)="loadPayments()"
              class="w-full">
            </p-dropdown>
          </div>

          <div class="col-12 md:col-3">
            <label class="block font-medium mb-2">Date Range</label>
            <p-calendar
              [(ngModel)]="filters.dateRange"
              selectionMode="range"
              [showButtonBar]="true"
              placeholder="Select date range"
              (onSelect)="loadPayments()"
              class="w-full">
            </p-calendar>
          </div>

          <div class="col-12 md:col-3">
            <label class="block font-medium mb-2">Amount Range</label>
            <p-dropdown
              [(ngModel)]="filters.amountRange"
              [options]="amountRanges"
              optionLabel="label"
              optionValue="value"
              placeholder="All Amounts"
              [showClear]="true"
              (onChange)="loadPayments()"
              class="w-full">
            </p-dropdown>
          </div>

          <div class="col-12 md:col-3">
            <label class="block font-medium mb-2">Actions</label>
            <div class="flex gap-2">
              <button 
                pButton 
                label="Reset" 
                icon="pi pi-refresh"
                class="p-button-outlined p-button-sm"
                (click)="resetFilters()">
              </button>
            </div>
          </div>
        </div>
      </p-card>

      <!-- Payments Table -->
      <p-card>
        <p-table 
          [value]="payments" 
          [loading]="loading"
          [paginator]="true"
          [rows]="10"
          [totalRecords]="totalRecords"
          [lazy]="true"
          (onLazyLoad)="onPageChange($event)"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payments">
          
          <ng-template pTemplate="header">
            <tr>
              <th>Project/Description</th>
              <th>{{ isClient ? 'Freelancer' : 'Client' }}</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-payment>
            <tr>
              <td>
                <div class="font-medium">{{ payment.project_title || payment.description }}</div>
                <div class="text-sm text-500" *ngIf="payment.payment_type">
                  {{ getPaymentTypeLabel(payment.payment_type) }}
                </div>
              </td>
              <td>
                <div class="flex align-items-center gap-2">
                  <div class="user-avatar">
                    {{ getUserInitials(payment.counterpart_name) }}
                  </div>
                  <span>{{ payment.counterpart_name || 'Unknown' }}</span>
                </div>
              </td>
              <td>
                <span class="font-medium text-lg">{{ payment.amount | currency }}</span>
                <div class="text-sm text-500" *ngIf="payment.platform_fee">
                  Fee: {{ payment.platform_fee | currency }}
                </div>
              </td>
              <td>
                <p-tag 
                  [value]="payment.status" 
                  [severity]="getStatusSeverity(payment.status)">
                </p-tag>
              </td>
              <td>
                <div>{{ payment.created_at | date:'medium' }}</div>
              </td>
              <td>
                <div class="flex gap-1">
                  <button 
                    pButton 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-text p-button-sm"
                    [routerLink]="['/dashboard/payments', payment.id]"
                    pTooltip="View Details">
                  </button>
                  <button 
                    pButton 
                    icon="pi pi-download" 
                    class="p-button-rounded p-button-text p-button-sm"
                    (click)="downloadReceipt(payment)"
                    pTooltip="Download Receipt">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <div class="empty-state">
                  <i class="pi pi-wallet text-4xl text-300 mb-3"></i>
                  <p class="text-500">No payments found</p>
                  <button 
                    *ngIf="isClient"
                    pButton 
                    label="Make First Payment" 
                    icon="pi pi-plus"
                    class="p-button-sm"
                    routerLink="/dashboard/payments/pay">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .payment-history {
      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
      }
    }
  `]
})
export class PaymentHistoryComponent implements OnInit {
  isClient = false;
  loading = false;
  payments: any[] = [];
  totalRecords = 0;

  filters = {
    status: null as string | null,
    dateRange: null as Date[] | null,
    amountRange: null as string | null
  };

  statusOptions = [
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' }
  ];

  amountRanges = [
    { label: '$0 - $100', value: '0-100' },
    { label: '$100 - $500', value: '100-500' },
    { label: '$500 - $1000', value: '500-1000' },
    { label: '$1000+', value: '1000+' }
  ];

  constructor(
    private paymentService: PaymentService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    this.loadPayments();
  }

  loadPayments(event?: any) {
    this.loading = true;
    
    const params: any = {
      page: event ? (event.first / event.rows) + 1 : 1,
      page_size: event?.rows || 10
    };

    // Apply filters
    if (this.filters.status) {
      params.status = this.filters.status;
    }

    if (this.filters.dateRange && this.filters.dateRange.length === 2) {
      params.start_date = this.filters.dateRange[0].toISOString();
      params.end_date = this.filters.dateRange[1].toISOString();
    }

    if (this.filters.amountRange) {
      const [min, max] = this.filters.amountRange.split('-');
      params.min_amount = parseInt(min);
      if (max !== '+') {
        params.max_amount = parseInt(max);
      }
    }

    this.paymentService.getPayments(params).subscribe({
      next: (response) => {
        this.payments = response.results || [];
        this.totalRecords = response.count || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.loadPayments(event);
  }

  resetFilters() {
    this.filters = {
      status: null as string | null,
      dateRange: null as Date[] | null,
      amountRange: null as string | null
    };
    this.loadPayments();
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'info';
    }
  }

  getPaymentTypeLabel(type: string): string {
    switch (type) {
      case 'completion': return 'Project Completion';
      case 'milestone': return 'Milestone Payment';
      case 'bonus': return 'Bonus Payment';
      default: return 'Payment';
    }
  }

  getUserInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  downloadReceipt(payment: any) {
    this.paymentService.getPaymentReceipt(payment.id).subscribe({
      next: (response) => {
        window.open(response.url, '_blank');
      },
      error: (error) => {
        console.error('Error downloading receipt:', error);
      }
    });
  }
}
