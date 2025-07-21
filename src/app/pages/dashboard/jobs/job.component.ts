import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '@/app/service/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
  jobForm!: FormGroup;
  jobs: any[] = [];
  editingJobId: string | null = null;

  constructor(private fb: FormBuilder, private jobService: JobService) {}

  ngOnInit() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      budget: [null],
      deadline: [null]
    });

    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getJobs().subscribe({
      next: (data) => (this.jobs = data)
    });
  }

  onSubmit() {
    if (this.jobForm.invalid) return;

    const data = this.jobForm.value;
    if (this.editingJobId) {
      this.jobService.updateJob(this.editingJobId, data).subscribe(() => {
        this.loadJobs();
        this.resetForm();
      });
    } else {
      this.jobService.createJob(data).subscribe(() => {
        this.loadJobs();
        this.resetForm();
      });
    }
  }

  editJob(job: any) {
    this.jobForm.patchValue(job);
    this.editingJobId = job.id;
  }

  deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe(() => this.loadJobs());
    }
  }

  resetForm() {
    this.jobForm.reset();
    this.editingJobId = null;
  }
}
