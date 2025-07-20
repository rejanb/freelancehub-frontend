import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../../../service/payment.service';
import { Payment } from '../../../../model/models';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TagModule,
    TimelineModule
  ],
  providers: [MessageService],
  template: `
    <div class="card" *ngIf="payment">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Payment Details</h2>
          <p class="text-500 mt-2 mb-0">Transaction #{{ payment.id }}</p>
        </div>
        <div class="flex gap-2">
          <button 
            pButton 
            icon="pi pi-arrow-left" 
            label="Back"
            class="p-button-text"
            routerLink="/dashboard/payments">
          </button>
          <button 
            pButton 
            icon="pi pi-download" 
            label="Download Receipt"
            (click)="downloadReceipt()">
          </button>
        </div>
      </div>

      <div class="grid">
        <div class="col-12 md:col-8">
          <!-- Payment Info -->
          <p-card>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="mb-3">
                  <label class="block font-bold mb-2">Amount</label>
                  <span class="text-2xl">{{ payment.amount | currency }}</span>
                </div>

                <div class="mb-3">
                  <label class="block font-bold mb-2">Status</label>
                  <p-tag 
                    [value]="payment.status"
                    [severity]="getStatusSeverity(payment.status)">
                  </p-tag>
                </div>

                <div class="mb-3">
                  <label class="block font-bold mb-2">Type</label>
                  <span class="capitalize">{{ payment.type }}</span>
                </div>

                <div class="mb-3">
                  <label class="block font-bold mb-2">Date</label>
                  <span>{{ payment.created_at | date:'medium' }}</span>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="mb-3" *ngIf="payment.fee_amount">
                  <label class="block font-bold mb-2">Fee</label>
                  <span>{{ payment.fee_amount | currency }}</span>
                </div>

                <div class="mb-3" *ngIf="payment.net_amount">
                  <label class="block font-bold mb-2">Net Amount</label>
                  <span>{{ payment.net_amount | currency }}</span>
                </div>

                <div class="mb-3" *ngIf="payment.payment_method">
                  <label class="block font-bold mb-2">Payment Method</label>
                  <span>{{ payment.payment_method }}</span>
                </div>

                <div class="mb-3" *ngIf="payment.transaction_id">
                  <label class="block font-bold mb-2">Transaction ID</label>
                  <span>{{ payment.transaction_id }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4" *ngIf="payment.description">
              <label class="block font-bold mb-2">Description</label>
              <p>{{ payment.description }}</p>
            </div>
          </p-card>

          <!-- Related Info -->
          <p-card class="mt-4">
            <div class="mb-4" *ngIf="payment.contract">
              <h3>Contract Details</h3>
              <div class="flex align-items-center gap-2">
                <a 
                  [routerLink]="['/dashboard/contracts', payment.contract.id]"
                  class="text-primary hover:underline">
                  {{ payment.contract.proposal?.job?.title }}
                </a>
                <p-tag 
                  [value]="payment.contract.status"
                  [severity]="getContractStatusSeverity(payment.contract.status)">
                </p-tag>
              </div>
            </div>

            <div *ngIf="payment.milestone">
              <h3>Milestone Details</h3>
              <p class="font-bold mb-2">{{ payment.milestone.title }}</p>
              <p>{{ payment.milestone.description }}</p>
              <div class="flex align-items-center gap-3 mt-3">
                <span>Amount: {{ payment.milestone.amount | currency }}</span>
                <p-tag 
                  [value]="payment.milestone.status"
                  [severity]="getMilestoneStatusSeverity(payment.milestone.status)">
                </p-tag>
              </div>
            </div>
          </p-card>
        </div>

        <div class="col-12 md:col-4">
          <!-- Parties -->
          <p-card>
            <div class="mb-4" *ngIf="payment.payer">
              <h3>Payer</h3>
              <p class="mb-1">{{ payment.payer.username }}</p>
              <small class="text-500">{{ payment.payer.email }}</small>
            </div>

            <div *ngIf="payment.payee">
              <h3>Payee</h3>
              <p class="mb-1">{{ payment.payee.username }}</p>
              <small class="text-500">{{ payment.payee.email }}</small>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `
})
export class PaymentDetailComponent implements OnInit {
  payment: Payment | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const paymentId = this.route.snapshot.params['id'];
    if (!paymentId) {
      this.router.navigate(['/dashboard/payments']);
      return;
    }

    this.loadPayment(paymentId);
  }

  loadPayment(id: number) {
    this.loading = true;
    this.paymentService.getPayment(id).subscribe({
      next: (payment) => {
        this.payment = payment;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payment details'
        });
        this.router.navigate(['/dashboard/payments']);
      }
    });
  }

  downloadReceipt() {
    if (!this.payment) return;

    this.paymentService.getPaymentReceipt(this.payment.id).subscribe({
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

  getContractStatusSeverity(status: string): string {
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

  getMilestoneStatusSeverity(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  }
} 