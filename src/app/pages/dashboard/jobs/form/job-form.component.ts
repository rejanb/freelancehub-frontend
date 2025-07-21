import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '@/app/service/job.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnChanges {
  @Input() jobToEdit: any = null;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private jobService: JobService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      budget: [null],
      deadline: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobToEdit'] && this.jobToEdit) {
      this.form.patchValue(this.jobToEdit);
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const job = this.form.value;

    if (this.jobToEdit && this.jobToEdit.id) {
      this.jobService.updateJob(this.jobToEdit.id, job).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    } else {
      this.jobService.createJob(job).subscribe(() => {
        this.form.reset();
        this.saved.emit();
      });
    }
  }
}
