import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '@/app/service/payment.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent implements OnChanges {
  @Input() paymentToEdit: any = null;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private paymentService: PaymentService) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      contractId: [''],
      amount: [null, Validators.required],
      method: [''],
      status: ['pending'],
      timestamp: [new Date()]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentToEdit'] && this.paymentToEdit) {
      this.form.patchValue(this.paymentToEdit);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const payment = this.form.value;

    if (this.paymentToEdit && this.paymentToEdit.id) {
      this.paymentService.updatePayment(this.paymentToEdit.id, payment).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    } else {
      this.paymentService.createPayment(payment).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    }
  }
}
