import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormComponent } from './form/payment-form.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, PaymentFormComponent, PaymentTableComponent],
  templateUrl: './payment.component.html'
})
export class PaymentComponent {
  refreshKey = 0;
  editingPayment: any = null;

  reload() {
    this.refreshKey++;
    this.editingPayment = null;
  }

  setEdit(payment: any) {
    this.editingPayment = payment;
  }
}
