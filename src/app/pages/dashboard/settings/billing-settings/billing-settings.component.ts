import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { SettingsService, BillingSettings } from '../../../../../service/settings.service';

@Component({
  selector: 'app-billing-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    InputSwitchModule,
    DialogModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Payment Methods -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="flex justify-content-between align-items-center p-3">
              <h3 class="m-0">Payment Methods</h3>
              <button
                pButton
                icon="pi pi-plus"
                label="Add Payment Method"
                class="p-button-secondary"
                (click)="showAddPaymentDialog()">
              </button>
            </div>
          </ng-template>

          <div *ngIf="settings?.default_payment_method" class="mb-4">
            <div class="flex align-items-center justify-content-between mb-3">
              <div>
                <div class="font-bold mb-2">Default Payment Method</div>
                <div class="flex align-items-center">
                  <i [class]="getPaymentIcon(settings.default_payment_method.type)" class="mr-2"></i>
                  <span>{{ getPaymentLabel(settings.default_payment_method) }}</span>
                </div>
              </div>
              <button
                pButton
                icon="pi pi-pencil"
                class="p-button-text"
                (click)="showEditPaymentDialog()">
              </button>
            </div>
          </div>

          <div *ngIf="settings?.default_payment_method" class="text-center p-4">
            <i class="pi pi-credit-card text-4xl text-500 mb-3"></i>
            <div class="text-500">No payment methods added</div>
            <button
              pButton
              label="Add Payment Method"
              class="p-button-text mt-3"
              (click)="showAddPaymentDialog()">
            </button>
          </div>
        </p-card>
      </div>

      <!-- Auto Recharge -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Auto Recharge</h3>
            </div>
          </ng-template>

          <form [formGroup]="autoRechargeForm" class="p-fluid">
            <div class="field">
              <div class="flex align-items-center justify-content-between mb-3">
                <label class="font-bold">Enable Auto Recharge</label>
                <p-inputSwitch formControlName="auto_recharge"></p-inputSwitch>
              </div>
              <small class="text-500">
                Automatically recharge your account when balance falls below threshold
              </small>
            </div>

            <div *ngIf="autoRechargeForm.get('auto_recharge')?.value">
              <div class="field">
                <label for="recharge_threshold" class="font-bold">Recharge Threshold *</label>
                <p-inputNumber
                  id="recharge_threshold"
                  formControlName="recharge_threshold"
                  mode="currency"
                  currency="USD"
                  [min]="10"
                  [max]="1000">
                </p-inputNumber>
                <small class="text-500">
                  Your account will be recharged when balance falls below this amount
                </small>
              </div>

              <div class="field">
                <label for="recharge_amount" class="font-bold">Recharge Amount *</label>
                <p-inputNumber
                  id="recharge_amount"
                  formControlName="recharge_amount"
                  mode="currency"
                  currency="USD"
                  [min]="50"
                  [max]="5000">
                </p-inputNumber>
                <small class="text-500">
                  Amount to add to your account when auto recharge is triggered
                </small>
              </div>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Tax Information -->
      <div class="col-12">
        <p-card>
          <ng-template pTemplate="header">
            <div class="flex justify-content-between align-items-center p-3">
              <h3 class="m-0">Tax Information</h3>
              <button
                pButton
                icon="pi pi-pencil"
                label="Edit"
                class="p-button-secondary"
                (click)="showTaxInfoDialog()">
              </button>
            </div>
          </ng-template>

          <div *ngIf="settings?.tax_information" class="grid">
            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-bold block mb-2">Tax ID Type</label>
                <div>{{ settings.tax_information.tax_id_type }}</div>
              </div>

              <div class="mb-3">
                <label class="font-bold block mb-2">Tax ID</label>
                <div>{{ settings.tax_information.tax_id }}</div>
              </div>

              <div class="mb-3">
                <label class="font-bold block mb-2">Name</label>
                <div>{{ settings.tax_information.name }}</div>
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="mb-3">
                <label class="font-bold block mb-2">Address</label>
                <div>{{ settings.tax_information.address.street }}</div>
                <div>{{ settings.tax_information.address.city }}, {{ settings.tax_information.address.state }}</div>
                <div>{{ settings.tax_information.address.postal_code }}</div>
                <div>{{ settings.tax_information.address.country }}</div>
              </div>
            </div>
          </div>

          <div *ngIf="!settings?.tax_information" class="text-center p-4">
            <i class="pi pi-file text-4xl text-500 mb-3"></i>
            <div class="text-500">No tax information added</div>
            <button
              pButton
              label="Add Tax Information"
              class="p-button-text mt-3"
              (click)="showTaxInfoDialog()">
            </button>
          </div>
        </p-card>
      </div>

      <!-- Save Button -->
      <div class="col-12">
        <div class="flex justify-content-end">
          <button
            pButton
            label="Save Changes"
            [loading]="saving"
            [disabled]="autoRechargeForm.invalid || saving"
            (click)="saveSettings()">
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Payment Method Dialog -->
    <p-dialog
      [(visible)]="showPaymentDialog"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [header]="editingPayment ? 'Edit Payment Method' : 'Add Payment Method'">
      <form [formGroup]="paymentForm" class="p-fluid">
        <!-- Payment form fields will be added here -->
        <div class="text-center p-4">
          <i class="pi pi-lock text-4xl text-500 mb-3"></i>
          <div class="text-500">Payment form integration will be implemented</div>
        </div>
      </form>
    </p-dialog>

    <!-- Tax Information Dialog -->
    <p-dialog
      [(visible)]="showTaxDialog"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      header="Tax Information">
      <form [formGroup]="taxForm" class="p-fluid">
        <div class="field">
          <label for="tax_id_type" class="font-bold">Tax ID Type *</label>
          <input
            id="tax_id_type"
            type="text"
            pInputText
            formControlName="tax_id_type"
            placeholder="e.g., EIN, SSN, VAT">
        </div>

        <div class="field">
          <label for="tax_id" class="font-bold">Tax ID *</label>
          <input
            id="tax_id"
            type="text"
            pInputText
            formControlName="tax_id">
        </div>

        <div class="field">
          <label for="name" class="font-bold">Name *</label>
          <input
            id="name"
            type="text"
            pInputText
            formControlName="name">
        </div>

        <div formGroupName="address">
          <div class="field">
            <label for="street" class="font-bold">Street Address *</label>
            <input
              id="street"
              type="text"
              pInputText
              formControlName="street">
          </div>

          <div class="field">
            <label for="city" class="font-bold">City *</label>
            <input
              id="city"
              type="text"
              pInputText
              formControlName="city">
          </div>

          <div class="field">
            <label for="state" class="font-bold">State/Province *</label>
            <input
              id="state"
              type="text"
              pInputText
              formControlName="state">
          </div>

          <div class="field">
            <label for="postal_code" class="font-bold">Postal Code *</label>
            <input
              id="postal_code"
              type="text"
              pInputText
              formControlName="postal_code">
          </div>

          <div class="field">
            <label for="country" class="font-bold">Country *</label>
            <input
              id="country"
              type="text"
              pInputText
              formControlName="country">
          </div>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <button
          pButton
          type="button"
          label="Cancel"
          class="p-button-text"
          (click)="showTaxDialog = false">
        </button>
        <button
          pButton
          type="button"
          label="Save"
          [loading]="savingTax"
          [disabled]="taxForm.invalid || savingTax"
          (click)="saveTaxInfo()">
        </button>
      </ng-template>
    </p-dialog>
  `
})
export class BillingSettingsComponent implements OnInit {
  settings!: BillingSettings;
  autoRechargeForm!: FormGroup;
  paymentForm!: FormGroup;
  taxForm!: FormGroup;
  saving = false;
  savingTax = false;
  showPaymentDialog = false;
  showTaxDialog = false;
  editingPayment = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private messageService: MessageService
  ) {
    this.initForms();
  }

  ngOnInit() {
    this.loadSettings();
  }

  initForms() {
    this.autoRechargeForm = this.fb.group({
      auto_recharge: [false],
      recharge_threshold: [{ value: null, disabled: true }, [Validators.required, Validators.min(10)]],
      recharge_amount: [{ value: null, disabled: true }, [Validators.required, Validators.min(50)]]
    });

    this.autoRechargeForm.get('auto_recharge')?.valueChanges.subscribe(enabled => {
      const threshold = this.autoRechargeForm.get('recharge_threshold');
      const amount = this.autoRechargeForm.get('recharge_amount');

      if (enabled) {
        threshold?.enable();
        amount?.enable();
      } else {
        threshold?.disable();
        amount?.disable();
      }
    });

    this.paymentForm = this.fb.group({
      // Payment form fields will be added here
    });

    this.taxForm = this.fb.group({
      tax_id_type: ['', [Validators.required]],
      tax_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postal_code: ['', [Validators.required]],
        country: ['', [Validators.required]]
      })
    });
  }

  loadSettings() {
    this.settingsService.getBillingSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.autoRechargeForm.patchValue({
          auto_recharge: settings.auto_recharge,
          recharge_threshold: settings.recharge_threshold,
          recharge_amount: settings.recharge_amount
        });
        if (settings.tax_information) {
          this.taxForm.patchValue(settings.tax_information);
        }
      },
      error: (error) => {
        console.error('Error loading billing settings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load billing settings'
        });
      }
    });
  }

  saveSettings() {
    if (this.autoRechargeForm.valid) {
      this.saving = true;
      this.settingsService.updateBillingSettings(this.autoRechargeForm.value).subscribe({
        next: (settings) => {
          this.settings = settings;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Billing settings updated successfully'
          });
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating billing settings:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update billing settings'
          });
          this.saving = false;
        }
      });
    }
  }

  saveTaxInfo() {
    if (this.taxForm.valid) {
      this.savingTax = true;
      this.settingsService.updateBillingSettings({
        tax_information: this.taxForm.value
      }).subscribe({
        next: (settings) => {
          this.settings = settings;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax information updated successfully'
          });
          this.showTaxDialog = false;
          this.savingTax = false;
        },
        error: (error) => {
          console.error('Error updating tax information:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update tax information'
          });
          this.savingTax = false;
        }
      });
    } else {
      Object.keys(this.taxForm.controls).forEach(key => {
        const control = this.taxForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  showAddPaymentDialog() {
    this.editingPayment = false;
    this.paymentForm.reset();
    this.showPaymentDialog = true;
  }

  showEditPaymentDialog() {
    this.editingPayment = true;
    this.showPaymentDialog = true;
  }

  showTaxInfoDialog() {
    if (this.settings?.tax_information) {
      this.taxForm.patchValue(this.settings.tax_information);
    }
    this.showTaxDialog = true;
  }

  getPaymentIcon(type: string): string {
    switch (type) {
      case 'card':
        return 'pi pi-credit-card';
      case 'bank_account':
        return 'pi pi-wallet';
      case 'paypal':
        return 'pi pi-paypal';
      default:
        return 'pi pi-money-bill';
    }
  }

  getPaymentLabel(method: any): string {
    if (!method) return '';

    switch (method.type) {
      case 'card':
        return `${method.brand} •••• ${method.last4}`;
      case 'bank_account':
        return `Bank Account •••• ${method.last4}`;
      case 'paypal':
        return 'PayPal Account';
      default:
        return 'Unknown Payment Method';
    }
  }
}
