import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DisputeService } from '@/app/service/dispute.service';

@Component({
  selector: 'app-dispute-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dispute-form.component.html'
})
export class DisputeFormComponent implements OnChanges {
  @Input() disputeToEdit: any = null;
  @Output() submitted = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private disputeService: DisputeService) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      paymentId: [''],
      reason: ['', Validators.required],
      status: ['open'],
      adminResponse: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disputeToEdit'] && this.disputeToEdit) {
      this.form.patchValue(this.disputeToEdit);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const dispute = this.form.value;

    if (this.disputeToEdit && this.disputeToEdit.id) {
      this.disputeService.updateDispute(this.disputeToEdit.id, dispute).subscribe(() => {
        this.form.reset();
        this.submitted.emit();
      });
    } else {
      this.disputeService.createDispute(dispute).subscribe(() => {
        this.form.reset();
        this.submitted.emit();
      });
    }
  }
}
