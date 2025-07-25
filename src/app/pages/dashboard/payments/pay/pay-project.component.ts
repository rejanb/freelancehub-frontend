import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { PaymentService } from '../../../../../service/payment.service';
import { ContractService } from '../../../../../service/contract.service';

@Component({
  selector: 'app-pay-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="pay-project">
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="m-0">Pay for Project</h2>
          <p class="text-500 mt-1 mb-0">Make a payment to your freelancer</p>
        </div>
        <button 
          pButton 
          icon="pi pi-arrow-left" 
          label="Back"
          class="p-button-text"
          routerLink="/dashboard/payments">
        </button>
      </div>

      <div class="grid">
        <!-- Payment Form -->
        <div class="col-12 md:col-8">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-3">
                <h3 class="m-0">Payment Details</h3>
              </div>
            </ng-template>

            <form [formGroup]="paymentForm" (ngSubmit)="processPayment()" class="p-fluid">
              <!-- Project Selection -->
              <div class="field">
                <label for="project">Select Project *</label>
                <p-dropdown
                  id="project"
                  formControlName="project_id"
                  [options]="projects"
                  optionLabel="title"
                  optionValue="id"
                  placeholder="Choose a project"
                  (onChange)="onProjectSelect($event)">
                </p-dropdown>
              </div>

              <!-- Amount -->
              <div class="field">
                <label for="amount">Payment Amount *</label>
                <p-inputNumber
                  id="amount"
                  formControlName="amount"
                  mode="currency"
                  currency="USD"
                  [min]="1"
                  [max]="10000"
                  placeholder="0.00">
                </p-inputNumber>
              </div>

              <!-- Description -->
              <div class="field">
                <label for="description">Payment Description</label>
                <input
                  id="description"
                  type="text"
                  pInputText
                  formControlName="description"
                  placeholder="Payment for completed work, milestone, etc.">
              </div>

              <!-- Payment Type -->
              <div class="field">
                <label for="payment_type">Payment Type</label>
                <p-dropdown
                  id="payment_type"
                  formControlName="payment_type"
                  [options]="paymentTypes"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select payment type">
                </p-dropdown>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-content-end gap-2 mt-4">
                <button 
                  pButton 
                  type="button"
                  label="Cancel" 
                  class="p-button-text"
                  routerLink="/dashboard/payments">
                </button>
                <button 
                  pButton 
                  type="submit"
                  label="Process Payment" 
                  icon="pi pi-credit-card"
                  class="p-button-success"
                  [loading]="processing"
                  [disabled]="paymentForm.invalid || processing">
                </button>
              </div>
            </form>
          </p-card>
        </div>

        <!-- Payment Summary -->
        <div class="col-12 md:col-4">
          <p-card>
            <ng-template pTemplate="header">
              <div class="p-3">
                <h3 class="m-0">Payment Summary</h3>
              </div>
            </ng-template>

            <div class="payment-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span class="font-medium">{{ paymentForm.get('amount')?.value | currency }}</span>
              </div>
              
              <div class="summary-row">
                <span>Platform Fee (5%):</span>
                <span class="font-medium">{{ calculateFee() | currency }}</span>
              </div>
              
              <div class="summary-row total">
                <span class="font-bold">Total:</span>
                <span class="font-bold text-lg">{{ calculateTotal() | currency }}</span>
              </div>

              <div class="mt-4 p-3 bg-blue-50 border-round">
                <div class="flex align-items-center gap-2 mb-2">
                  <i class="pi pi-info-circle text-blue-600"></i>
                  <span class="font-medium text-blue-800">Payment Info</span>
                </div>
                <ul class="text-sm text-blue-700 m-0 pl-3">
                  <li>Payments are processed securely via Stripe</li>
                  <li>Freelancer receives payment instantly</li>
                  <li>You'll receive an email confirmation</li>
                </ul>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pay-project {
      .payment-summary {
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--surface-border);

          &.total {
            border-top: 2px solid var(--surface-border);
            border-bottom: none;
            margin-top: 0.5rem;
            padding-top: 1rem;
          }
        }
      }
    }
  `]
})
export class PayProjectComponent implements OnInit {
  paymentForm: FormGroup;
  processing = false;
  projects: any[] = [];
  
  paymentTypes = [
    { label: 'Project Completion', value: 'completion' },
    { label: 'Milestone Payment', value: 'milestone' },
    { label: 'Bonus Payment', value: 'bonus' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      project_id: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: ['Payment for completed work'],
      payment_type: ['completion']
    });
  }

  ngOnInit() {
    this.loadProjects();
    
    // Pre-fill if project ID is provided in query params
    const projectId = this.route.snapshot.queryParams['project'];
    if (projectId) {
      this.paymentForm.patchValue({ project_id: parseInt(projectId) });
    }
  }

  loadProjects() {
    this.contractService.getContracts({ status: 'active' }).subscribe({
      next: (response) => {
        this.projects = response.results?.map((contract: any) => ({
          id: contract.id,
          title: contract.proposal?.job?.title || 'Untitled Project',
          freelancer: contract.proposal?.user?.username,
          amount: contract.amount
        })) || [];
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load projects'
        });
      }
    });
  }

  onProjectSelect(event: any) {
    const selectedProject = this.projects.find(p => p.id === event.value);
    if (selectedProject) {
      this.paymentForm.patchValue({
        amount: selectedProject.amount,
        description: `Payment for ${selectedProject.title}`
      });
    }
  }

  calculateFee(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    return amount * 0.05; // 5% platform fee
  }

  calculateTotal(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    return amount + this.calculateFee();
  }

  processPayment() {
    if (this.paymentForm.valid) {
      this.processing = true;
      
      const paymentData = {
        ...this.paymentForm.value,
        total_amount: this.calculateTotal(),
        platform_fee: this.calculateFee()
      };

      this.paymentService.createQuickPayment(paymentData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Payment Processed',
            detail: `Payment of $${this.calculateTotal().toFixed(2)} has been processed successfully`
          });
          
          this.processing = false;
          this.router.navigate(['/dashboard/payments']);
        },
        error: (error) => {
          console.error('Payment error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Payment Failed',
            detail: 'Failed to process payment. Please try again.'
          });
          this.processing = false;
        }
      });
    }
  }
}
