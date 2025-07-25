import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../../../service/payment.service';
import { TokenService } from '../../../../utils/token.service';
import { RoleConst } from '../../../../const/api-const';

interface PaymentStats {
  role: string;
  platform_stats?: any;
  spending_stats?: any;
  earnings_stats?: any;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Role-Based Stats -->
      <div class="col-12">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Payment Dashboard - {{ userRole | titlecase }}</h3>
            </div>
          </ng-template>

          <!-- Admin Stats -->
          <div *ngIf="userRole === 'admin' && stats?.platform_stats" class="grid">
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.platform_stats.total_payments.amount | currency }}</div>
                <div class="text-500">Total Payments</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.platform_stats.platform_revenue | currency }}</div>
                <div class="text-500">Platform Revenue</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.platform_stats.active_contracts }}</div>
                <div class="text-500">Active Contracts</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.platform_stats.total_users }}</div>
                <div class="text-500">Total Users</div>
              </div>
            </div>
          </div>

          <!-- Client Stats -->
          <div *ngIf="userRole === 'client' && stats?.spending_stats" class="grid">
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.spending_stats.total_spent | currency }}</div>
                <div class="text-500">Total Spent</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.spending_stats.pending_payments | currency }}</div>
                <div class="text-500">Pending Payments</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.spending_stats.active_contracts }}</div>
                <div class="text-500">Active Contracts</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.spending_stats.recent_payments_count }}</div>
                <div class="text-500">Recent Payments</div>
              </div>
            </div>
          </div>

          <!-- Freelancer Stats -->
          <div *ngIf="userRole === 'freelancer' && stats?.earnings_stats" class="grid">
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.earnings_stats.total_earned | currency }}</div>
                <div class="text-500">Total Earned</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.earnings_stats.pending_earnings | currency }}</div>
                <div class="text-500">Pending Earnings</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.earnings_stats.active_contracts }}</div>
                <div class="text-500">Active Contracts</div>
              </div>
            </div>
            <div class="col-6 md:col-3">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ stats.earnings_stats.recent_payments_count }}</div>
                <div class="text-500">Recent Payments</div>
              </div>
            </div>
          </div>
        </p-card>
      </div>

      <!-- Quick Payment Processing -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Process Payment</h3>
            </div>
          </ng-template>

          <form [formGroup]="testPaymentForm" (ngSubmit)="createTestPayment()" class="p-fluid">
            <div class="field">
              <label for="amount">Amount</label>
              <p-inputNumber
                id="amount"
                formControlName="amount"
                mode="currency"
                currency="USD"
                [min]="1"
                [max]="1000">
              </p-inputNumber>
            </div>

            <div class="field">
              <label for="description">Description</label>
              <input
                id="description"
                type="text"
                pInputText
                formControlName="description"
                placeholder="Payment description">
            </div>

            <button
              pButton
              type="submit"
              label="Process Payment"
              [loading]="loading"
              [disabled]="testPaymentForm.invalid || loading">
            </button>
          </form>
        </p-card>
      </div>

      <!-- Payment Tools -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Payment Tools</h3>
            </div>
          </ng-template>

          <div class="flex flex-column gap-3">
            <button
              pButton
              label="Refresh Stats"
              icon="pi pi-refresh"
              class="p-button-secondary"
              (click)="loadStats()">
            </button>

            <button
              pButton
              label="View All Payments"
              icon="pi pi-list"
              class="p-button-info"
              routerLink="/dashboard/payments">
            </button>

            <div class="text-500 text-sm">
              <strong>Environment:</strong> Test Mode<br>
              <strong>Webhook URL:</strong><br>
              <code>{{apiBaseUrl}}/api/payments/stripe/webhook/</code>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
  testPaymentForm: FormGroup;
  loading = false;
  stats: PaymentStats | null = null;
  userRole = '';
  apiBaseUrl = 'http://localhost:8000'; // Dev URL

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.testPaymentForm = this.fb.group({
      amount: [50, [Validators.required, Validators.min(1)]],
      description: ['Payment for services', Validators.required]
    });
  }

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.userRole = currentUser?.type || '';
    this.loadStats();
  }

  loadStats() {
    this.paymentService.getPaymentStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payment statistics'
        });
      }
    });
  }

  createTestPayment() {
    if (this.testPaymentForm.valid) {
      this.loading = true;
      
      const paymentData = {
        amount: this.testPaymentForm.value.amount,
        description: this.testPaymentForm.value.description
        // contract_id is optional, so we don't include it for test payments
      };

      this.paymentService.createQuickPayment(paymentData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Payment processed: $${response.amount}`
          });
          this.testPaymentForm.reset({
            amount: 50,
            description: 'Payment for services'
          });
          this.loadStats(); // Refresh stats
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating payment:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to process payment'
          });
          this.loading = false;
        }
      });
    }
  }
}
