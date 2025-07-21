import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '@/app/service/payment.service';

@Component({
  selector: 'app-payment-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-table.component.html'
})
export class PaymentTableComponent implements OnChanges {
  @Input() refreshKey: number = 0;
  @Output() edit = new EventEmitter<any>();

  payments: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnChanges(): void {
    this.paymentService.getAll().subscribe(data => {
      this.payments = data;
    });
  }

  deletePayment(id: string) {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(id).subscribe(() => this.ngOnChanges());
    }
  }
}
