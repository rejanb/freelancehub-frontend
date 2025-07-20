import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { PaymentService, WithdrawalRequest } from '../../../../../service/payment.service';

interface PaymentMethodFields {
  bank: string[];
  paypal: string[];
}

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-6 md:col-offset-3">
        <p-card>
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Withdraw Funds</h2>
            <button 
              pButton 
              icon="pi pi-arrow-left" 
              label="Back"
              class="p-button-text"
              routerLink="/dashboard/payments">
            </button>
          </div>

          <div class="mb-4">
            <label class="block font-bold mb-2">Available Balance</label>
            <span class="text-2xl">{{ availableBalance | currency }}</span>
          </div>

          <form [formGroup]="withdrawForm" (ngSubmit)="onSubmit()" class="p-fluid">
            <div class="field">
              <label for="amount">Amount to Withdraw</label>
              <p-inputNumber 
                id="amount" 
                formControlName="amount"
                [min]="0"
                [max]="availableBalance"
                [mode]="'currency'" 
                [currency]="'USD'"
                [class.ng-invalid]="withdrawForm.get('amount')?.invalid && withdrawForm.get('amount')?.touched">
              </p-inputNumber>
              <small 
                class="p-error" 
                *ngIf="withdrawForm.get('amount')?.invalid && withdrawForm.get('amount')?.touched">
                Amount is required and must be between $1 and {{ availableBalance | currency }}
              </small>
            </div>

            <div class="field">
              <label for="payment_method">Payment Method</label>
              <p-dropdown
                id="payment_method"
                formControlName="payment_method"
                [options]="paymentMethodOptions"
                placeholder="Select payment method"
                [class.ng-invalid]="withdrawForm.get('payment_method')?.invalid && withdrawForm.get('payment_method')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="withdrawForm.get('payment_method')?.invalid && withdrawForm.get('payment_method')?.touched">
                Payment method is required
              </small>
            </div>

            <!-- Bank Account Details -->
            <div *ngIf="withdrawForm.get('payment_method')?.value === 'bank'" formGroupName="account_details">
              <div class="field">
                <label for="bank_name">Bank Name</label>
                <input 
                  id="bank_name" 
                  type="text" 
                  pInputText 
                  formControlName="bank_name"
                  [class.ng-invalid]="withdrawForm.get('account_details.bank_name')?.invalid && withdrawForm.get('account_details.bank_name')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.bank_name')?.invalid && withdrawForm.get('account_details.bank_name')?.touched">
                  Bank name is required
                </small>
              </div>

              <div class="field">
                <label for="account_name">Account Holder Name</label>
                <input 
                  id="account_name" 
                  type="text" 
                  pInputText 
                  formControlName="account_name"
                  [class.ng-invalid]="withdrawForm.get('account_details.account_name')?.invalid && withdrawForm.get('account_details.account_name')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.account_name')?.invalid && withdrawForm.get('account_details.account_name')?.touched">
                  Account holder name is required
                </small>
              </div>

              <div class="field">
                <label for="account_number">Account Number</label>
                <input 
                  id="account_number" 
                  type="text" 
                  pInputText 
                  formControlName="account_number"
                  [class.ng-invalid]="withdrawForm.get('account_details.account_number')?.invalid && withdrawForm.get('account_details.account_number')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.account_number')?.invalid && withdrawForm.get('account_details.account_number')?.touched">
                  Account number is required
                </small>
              </div>

              <div class="field">
                <label for="routing_number">Routing Number</label>
                <input 
                  id="routing_number" 
                  type="text" 
                  pInputText 
                  formControlName="routing_number"
                  [class.ng-invalid]="withdrawForm.get('account_details.routing_number')?.invalid && withdrawForm.get('account_details.routing_number')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.routing_number')?.invalid && withdrawForm.get('account_details.routing_number')?.touched">
                  Routing number is required
                </small>
              </div>

              <div class="field">
                <label for="swift_code">SWIFT Code</label>
                <input 
                  id="swift_code" 
                  type="text" 
                  pInputText 
                  formControlName="swift_code"
                  [class.ng-invalid]="withdrawForm.get('account_details.swift_code')?.invalid && withdrawForm.get('account_details.swift_code')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.swift_code')?.invalid && withdrawForm.get('account_details.swift_code')?.touched">
                  SWIFT code is required
                </small>
              </div>
            </div>

            <!-- PayPal Details -->
            <div *ngIf="withdrawForm.get('payment_method')?.value === 'paypal'" formGroupName="account_details">
              <div class="field">
                <label for="paypal_email">PayPal Email</label>
                <input 
                  id="paypal_email" 
                  type="email" 
                  pInputText 
                  formControlName="paypal_email"
                  [class.ng-invalid]="withdrawForm.get('account_details.paypal_email')?.invalid && withdrawForm.get('account_details.paypal_email')?.touched">
                <small 
                  class="p-error" 
                  *ngIf="withdrawForm.get('account_details.paypal_email')?.invalid && withdrawForm.get('account_details.paypal_email')?.touched">
                  Valid PayPal email is required
                </small>
              </div>
            </div>

            <button 
              pButton 
              type="submit" 
              label="Withdraw Funds"
              [loading]="loading"
              [disabled]="withdrawForm.invalid || loading || !availableBalance">
            </button>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputtext.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-trigger,
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-label {
        border-color: var(--red-500);
      }
      .p-inputnumber.ng-invalid.ng-touched .p-inputtext {
        border-color: var(--red-500);
      }
    }
  `]
})
export class WithdrawComponent implements OnInit {
  withdrawForm!: FormGroup;
  loading = false;
  availableBalance = 0;

  paymentMethodOptions = [
    { label: 'Bank Transfer', value: 'bank' },
    { label: 'PayPal', value: 'paypal' }
  ];

  paymentMethodFields: PaymentMethodFields = {
    bank: ['bank_name', 'account_name', 'account_number', 'routing_number', 'swift_code'],
    paypal: ['paypal_email']
  };

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadAvailableBalance();
    this.setupPaymentMethodValidation();
  }

  initForm() {
    this.withdrawForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      payment_method: ['', Validators.required],
      account_details: this.fb.group({
        bank_name: [''],
        account_name: [''],
        account_number: [''],
        routing_number: [''],
        swift_code: [''],
        paypal_email: ['']
      })
    });
  }

  setupPaymentMethodValidation() {
    this.withdrawForm.get('payment_method')?.valueChanges.subscribe(method => {
      const accountDetailsGroup = this.withdrawForm.get('account_details') as FormGroup;
      
      // Reset all validators
      Object.keys(accountDetailsGroup.controls).forEach(key => {
        accountDetailsGroup.get(key)?.clearValidators();
        accountDetailsGroup.get(key)?.updateValueAndValidity();
      });

      // Set validators based on selected method
      if (method === 'bank') {
        this.paymentMethodFields.bank.forEach(field => {
          accountDetailsGroup.get(field)?.setValidators([Validators.required]);
          accountDetailsGroup.get(field)?.updateValueAndValidity();
        });
      } else if (method === 'paypal') {
        accountDetailsGroup.get('paypal_email')?.setValidators([
          Validators.required,
          Validators.email
        ]);
        accountDetailsGroup.get('paypal_email')?.updateValueAndValidity();
      }
    });
  }

  loadAvailableBalance() {
    this.paymentService.getAvailableBalance().subscribe({
      next: (response) => {
        this.availableBalance = response.balance;
        this.withdrawForm.get('amount')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.availableBalance)
        ]);
        this.withdrawForm.get('amount')?.updateValueAndValidity();
      },
      error: (error) => {
        console.error('Error loading balance:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load available balance'
        });
      }
    });
  }

  onSubmit() {
    if (this.withdrawForm.valid) {
      this.loading = true;

      const withdrawalData: WithdrawalRequest = {
        amount: this.withdrawForm.value.amount,
        payment_method: this.withdrawForm.value.payment_method,
        account_details: this.withdrawForm.value.account_details
      };

      this.paymentService.requestWithdrawal(withdrawalData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Withdrawal request submitted successfully'
          });
          this.loading = false;
          this.withdrawForm.reset();
          this.loadAvailableBalance();
        },
        error: (error) => {
          console.error('Error requesting withdrawal:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit withdrawal request'
          });
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.withdrawForm.controls).forEach(key => {
        const control = this.withdrawForm.get(key);
        control?.markAsTouched();
      });
    }
  }
} 