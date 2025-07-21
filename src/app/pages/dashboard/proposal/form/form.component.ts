import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProposalService } from '@/app/service/proposal.service';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proposal-form.component.html'
})
export class ProposalFormComponent implements OnChanges {
  @Input() proposalToEdit: any = null;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private proposalService: ProposalService) {
    this.form = this.fb.group({
      jobId: ['', Validators.required],
      userId: ['', Validators.required],
      coverLetter: [''],
      budgetOffer: [null],
      estimatedTime: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proposalToEdit'] && this.proposalToEdit) {
      this.form.patchValue(this.proposalToEdit);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const proposal = this.form.value;

    if (this.proposalToEdit && this.proposalToEdit.id) {
      this.proposalService.updateProposal(this.proposalToEdit.id, proposal).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    } else {
      this.proposalService.createProposal(proposal).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    }
  }
}
