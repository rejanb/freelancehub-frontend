import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { PaymentService } from '../../../../../service/payment.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

@Component({
  selector: 'app-payment-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    ChartModule
  ],
  template: `
    <div class="payment-dashboard">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">{{ isClient ? 'Payments' : 'Earnings' }}</h2>
          <p class="text-500 mt-1 mb-0">
            {{ isClient ? 'Manage your project payments' : 'Track your earnings and withdrawals' }}
          </p>
        </div>
        
        <div class="flex gap-2">
          <button 
            *ngIf="isClient"
            pButton 
            label="Pay for Project" 
            icon="pi pi-credit-card"
            class="p-button-success"
            routerLink="/dashboard/payments/pay">
          </button>
          
          <button 
            *ngIf="!isClient"
            pButton 
            label="Withdraw Funds" 
            icon="pi pi-money-bill"
            class="p-button-success"
            [disabled]="availableBalance <= 0"
            routerLink="/dashboard/payments/withdraw">
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon bg-blue-100">
                <i class="pi pi-wallet text-blue-600"></i>
              </div>
              <div>
                <div class="stats-value">{{ totalAmount | currency }}</div>
                <div class="stats-label">
                  {{ isClient ? 'Total Spent' : 'Total Earned' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon bg-green-100">
                <i class="pi pi-check-circle text-green-600"></i>
              </div>
              <div>
                <div class="stats-value">{{ completedPayments | currency }}</div>
                <div class="stats-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stats-card">
            <div class="stats-content">
              <div class="stats-icon bg-orange-100">
                <i class="pi pi-clock text-orange-600"></i>
              </div>
              <div>
                <div class="stats-value">{{ pendingPayments | currency }}</div>
                <div class="stats-label">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-3">
          <div class="stats-card" *ngIf="!isClient">
            <div class="stats-content">
              <div class="stats-icon bg-purple-100">
                <i class="pi pi-dollar text-purple-600"></i>
              </div>
              <div>
                <div class="stats-value">{{ availableBalance | currency }}</div>
                <div class="stats-label">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <p-card>
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center p-3">
            <h3 class="m-0">Recent {{ isClient ? 'Payments' : 'Earnings' }}</h3>
            <button 
              pButton 
              label="View All" 
              icon="pi pi-eye"
              class="p-button-text"
              routerLink="/dashboard/payments/history">
            </button>
          </div>
        </ng-template>

        <p-table [value]="recentPayments" [loading]="loading">
          <ng-template pTemplate="header">
            <tr>
              <th>Project</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-payment>
            <tr>
              <td>
                <div class="font-medium">{{ payment.project_title || 'Project Payment' }}</div>
                <div class="text-sm text-500">{{ payment.description }}</div>
              </td>
              <td>
                <span class="font-medium">{{ payment.amount | currency }}</span>
              </td>
              <td>
                <p-tag 
                  [value]="payment.status" 
                  [severity]="getStatusSeverity(payment.status)">
                </p-tag>
              </td>
              <td>{{ payment.created_at | date:'medium' }}</td>
              <td>
                <button 
                  pButton 
                  icon="pi pi-eye" 
                  class="p-button-rounded p-button-text p-button-sm"
                  [routerLink]="['/dashboard/payments', payment.id]">
                </button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center p-4">
                <div class="empty-state">
                  <i class="pi pi-wallet text-4xl text-300 mb-3"></i>
                  <p class="text-500">{{ isClient ? 'No payments made yet' : 'No earnings yet' }}</p>
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
    .payment-dashboard {
      .stats-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        height: 100%;
      }

      .stats-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .stats-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .stats-label {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        margin-top: 0.25rem;
      }

      .empty-state {
        text-align: center;
        padding: 2rem;
      }
    }
  `]
})
export class PaymentDashboardComponent implements OnInit {
  isClient = false;
  loading = false;
  recentPayments: any[] = [];
  
  // Stats
  totalAmount = 0;
  completedPayments = 0;
  pendingPayments = 0;
  availableBalance = 0;

  constructor(
    private paymentService: PaymentService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load stats
    this.paymentService.getPaymentStats().subscribe({
      next: (stats) => {
        if (this.isClient && stats.spending_stats) {
          this.totalAmount = stats.spending_stats.total_spent || 0;
          this.pendingPayments = stats.spending_stats.pending_payments || 0;
          this.completedPayments = this.totalAmount - this.pendingPayments;
        } else if (!this.isClient && stats.earnings_stats) {
          this.totalAmount = stats.earnings_stats.total_earned || 0;
          this.pendingPayments = stats.earnings_stats.pending_earnings || 0;
          this.completedPayments = this.totalAmount - this.pendingPayments;
          this.availableBalance = stats.earnings_stats.available_balance || 0;
        }
      },
      error: (error) => console.error('Error loading stats:', error)
    });

    // Load recent payments
    this.paymentService.getPayments({ page: 1, page_size: 5 }).subscribe({
      next: (response) => {
        this.recentPayments = response.results || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status: string): any {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      default: return 'info';
    }
  }
}
