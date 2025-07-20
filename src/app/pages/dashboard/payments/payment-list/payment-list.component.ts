import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { PaymentService, PaymentFilters, PaymentStats } from '../../../../../service/payment.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';
import { Payment } from '../../../../model/models';

interface PaymentListFilters {
  type: 'milestone' | 'escrow' | 'withdrawal' | null;
  status: 'pending' | 'completed' | 'failed' | null;
  dateRange: Date[] | null;
  minAmount: number | null;
  maxAmount: number | null;
  sort: string | null;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-payment-list',
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
    InputNumberModule,
    ChartModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Payment Stats -->
      <div class="col-12 md:col-4">
        <p-card>
          <div class="mb-3">
            <label class="block font-bold mb-2">{{ isClient ? 'Total Spent' : 'Total Earnings' }}</label>
            <span class="text-2xl">{{ stats?.total_earnings | currency }}</span>
          </div>

          <div class="mb-3">
            <label class="block font-bold mb-2">Pending Payments</label>
            <span class="text-xl">{{ stats?.pending_payments | currency }}</span>
          </div>

          <div class="mb-3">
            <label class="block font-bold mb-2">Available Balance</label>
            <span class="text-xl">{{ stats?.available_balance | currency }}</span>
          </div>

          <div *ngIf="!isClient" class="mt-4">
            <button 
              pButton 
              label="Withdraw Funds" 
              icon="pi pi-money-bill"
              routerLink="withdraw"
              [disabled]="!stats?.available_balance">
            </button>
          </div>
        </p-card>

        <!-- Monthly Chart -->
        <p-card class="mt-4">
          <h3>Monthly {{ isClient ? 'Spending' : 'Earnings' }}</h3>
          <p-chart 
            type="bar" 
            [data]="chartData" 
            [options]="chartOptions">
          </p-chart>
        </p-card>
      </div>

      <div class="col-12 md:col-8">
        <!-- Filters -->
        <p-card>
          <div class="grid">
            <div class="col-12 md:col-6">
              <p-dropdown
                [options]="typeOptions"
                [(ngModel)]="filters.type"
                (onChange)="loadPayments()"
                placeholder="Payment Type"
                [showClear]="true"
                class="w-full">
              </p-dropdown>
            </div>

            <div class="col-12 md:col-6">
              <p-dropdown
                [options]="statusOptions"
                [(ngModel)]="filters.status"
                (onChange)="loadPayments()"
                placeholder="Status"
                [showClear]="true"
                class="w-full">
              </p-dropdown>
            </div>

            <div class="col-12 md:col-6">
              <p-calendar
                [(ngModel)]="filters.dateRange"
                selectionMode="range"
                [showButtonBar]="true"
                (onSelect)="onDateSelect()"
                placeholder="Date range"
                class="w-full">
              </p-calendar>
            </div>

            <div class="col-12 md:col-6">
              <p-dropdown
                [options]="sortOptions"
                [(ngModel)]="filters.sort"
                (onChange)="loadPayments()"
                placeholder="Sort by"
                [showClear]="true"
                class="w-full">
              </p-dropdown>
            </div>

            <div class="col-12 md:col-6">
              <p-inputNumber
                [(ngModel)]="filters.minAmount"
                placeholder="Min Amount"
                mode="currency"
                currency="USD"
                (onBlur)="loadPayments()"
                class="w-full">
              </p-inputNumber>
            </div>

            <div class="col-12 md:col-6">
              <p-inputNumber
                [(ngModel)]="filters.maxAmount"
                placeholder="Max Amount"
                mode="currency"
                currency="USD"
                (onBlur)="loadPayments()"
                class="w-full">
              </p-inputNumber>
            </div>
          </div>
        </p-card>

        <!-- Payments Table -->
        <p-card class="mt-4">
          <p-table 
            [value]="payments" 
            [loading]="loading"
            [paginator]="true" 
            [rows]="10"
            [showCurrentPageReport]="true"
            [totalRecords]="totalRecords"
            [rowsPerPageOptions]="[10, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payments"
            (onPage)="onPageChange($event)">
            
            <ng-template pTemplate="header">
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-payment>
              <tr>
                <td>
                  <a 
                    [routerLink]="['/dashboard/payments', payment.id]"
                    class="text-primary hover:underline">
                    #{{ payment.id }}
                  </a>
                </td>
                <td>
                  <span class="capitalize">{{ payment.type }}</span>
                </td>
                <td>{{ payment.amount | currency }}</td>
                <td>
                  <p-tag 
                    [value]="payment.status"
                    [severity]="getStatusSeverity(payment.status)">
                  </p-tag>
                </td>
                <td>{{ payment.created_at | date:'medium' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      pButton 
                      icon="pi pi-eye" 
                      class="p-button-rounded p-button-text"
                      [routerLink]="['/dashboard/payments', payment.id]"
                      pTooltip="View Details">
                    </button>
                    <button 
                      pButton 
                      icon="pi pi-download" 
                      class="p-button-rounded p-button-text"
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
                  No payments found.
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-dropdown {
        width: 100%;
      }
      .p-calendar {
        width: 100%;
      }
      .p-inputnumber {
        width: 100%;
      }
    }
  `]
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  totalRecords = 0;
  isClient = false;
  stats: PaymentStats | null = null;

  filters: PaymentListFilters = {
    type: null,
    status: null,
    dateRange: null,
    minAmount: null,
    maxAmount: null,
    sort: null,
    page: 1,
    pageSize: 10
  };

  typeOptions = [
    { label: 'Milestone', value: 'milestone' },
    { label: 'Escrow', value: 'escrow' },
    { label: 'Withdrawal', value: 'withdrawal' }
  ];

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' }
  ];

  sortOptions = [
    { label: 'Newest First', value: '-created_at' },
    { label: 'Oldest First', value: 'created_at' },
    { label: 'Amount: High to Low', value: '-amount' },
    { label: 'Amount: Low to High', value: 'amount' }
  ];

  chartData: any = {
    labels: [],
    datasets: [
      {
        label: 'Amount',
        data: [],
        backgroundColor: '#2196F3'
      }
    ]
  };

  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return '$' + value;
          }
        }
      }
    }
  };

  constructor(
    private paymentService: PaymentService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    
    this.loadPayments();
    this.loadStats();
  }

  loadPayments() {
    this.loading = true;
    
    const filters: PaymentFilters = {
      type: this.filters.type || undefined,
      status: this.filters.status || undefined,
      page: this.filters.page,
      page_size: this.filters.pageSize,
      ordering: this.filters.sort || undefined
    };

    if (this.filters.minAmount) {
      filters.min_amount = this.filters.minAmount;
    }

    if (this.filters.maxAmount) {
      filters.max_amount = this.filters.maxAmount;
    }

    if (this.filters.dateRange && this.filters.dateRange.length === 2) {
      const [start, end] = this.filters.dateRange;
      if (start) filters.start_date = start.toISOString();
      if (end) filters.end_date = end.toISOString();
    }

    this.paymentService.getPayments(filters).subscribe({
      next: (response) => {
        this.payments = response.results;
        this.totalRecords = response.count;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payments'
        });
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.paymentService.getPaymentStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.updateChart(stats.monthly_earnings);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  updateChart(monthlyData: { month: string; amount: number }[]) {
    this.chartData = {
      labels: monthlyData.map(item => item.month),
      datasets: [
        {
          label: 'Amount',
          data: monthlyData.map(item => item.amount),
          backgroundColor: '#2196F3'
        }
      ]
    };
  }

  onPageChange(event: any) {
    this.filters.page = event.page + 1;
    this.filters.pageSize = event.rows;
    this.loadPayments();
  }

  onDateSelect() {
    this.filters.page = 1;
    this.loadPayments();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  }

  downloadReceipt(payment: Payment) {
    this.paymentService.getPaymentReceipt(payment.id).subscribe({
      next: (response) => {
        window.open(response.url, '_blank');
      },
      error: (error) => {
        console.error('Error downloading receipt:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download receipt'
        });
      }
    });
  }
} 