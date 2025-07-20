import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelect } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { JobService } from '../../../../../service/job.service';
import { Job } from '../../../../model/models';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    CalendarModule,
    MultiSelect,
    FileUploadModule,
    CardModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <h2>{{ isEditMode ? 'Edit Job' : 'Create New Job' }}</h2>
      
      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()" class="p-fluid">
        <div class="grid">
          <!-- Title -->
          <div class="col-12">
            <div class="field">
              <label for="title">Job Title</label>
              <input 
                id="title" 
                type="text" 
                pInputText 
                formControlName="title"
                [placeholder]="'e.g., Full Stack Developer Needed for E-commerce Project'"
                [class.ng-invalid]="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
              <small 
                class="p-error" 
                *ngIf="jobForm.get('title')?.invalid && jobForm.get('title')?.touched">
                Title is required
              </small>
            </div>
          </div>

          <!-- Description -->
          <div class="col-12">
            <div class="field">
              <label for="description">Job Description</label>
              <textarea 
                id="description" 
                pInputTextarea 
                formControlName="description"
                [rows]="5" 
                [autoResize]="true"
                placeholder="Describe the job requirements, responsibilities, and expectations..."
                [class.ng-invalid]="jobForm.get('description')?.invalid && jobForm.get('description')?.touched">
              </textarea>
              <small 
                class="p-error" 
                *ngIf="jobForm.get('description')?.invalid && jobForm.get('description')?.touched">
                Description is required
              </small>
            </div>
          </div>

          <!-- Budget -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="budget">Budget</label>
              <p-inputNumber 
                id="budget" 
                formControlName="budget"
                [min]="0"
                [mode]="'currency'" 
                [currency]="'USD'"
                [class.ng-invalid]="jobForm.get('budget')?.invalid && jobForm.get('budget')?.touched">
              </p-inputNumber>
              <small 
                class="p-error" 
                *ngIf="jobForm.get('budget')?.invalid && jobForm.get('budget')?.touched">
                Budget is required and must be greater than 0
              </small>
            </div>
          </div>

          <!-- Deadline -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="deadline">Deadline</label>
              <p-calendar 
                id="deadline" 
                formControlName="deadline"
                [showTime]="true"
                [minDate]="minDate"
                [class.ng-invalid]="jobForm.get('deadline')?.invalid && jobForm.get('deadline')?.touched">
              </p-calendar>
              <small 
                class="p-error" 
                *ngIf="jobForm.get('deadline')?.invalid && jobForm.get('deadline')?.touched">
                Deadline is required and must be in the future
              </small>
            </div>
          </div>

          <!-- Location -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="location">Location</label>
              <input 
                id="location" 
                type="text" 
                pInputText 
                formControlName="location"
                placeholder="e.g., Remote, New York, Worldwide">
            </div>
          </div>

          <!-- Skills Required -->
          <div class="col-12 md:col-6">
            <div class="field">
              <label for="skills">Required Skills</label>
              <p-multiSelect 
                id="skills" 
                formControlName="skills_required"
                [options]="availableSkills"
                [placeholder]="'Select required skills'"
                [filter]="true"
                [showToggleAll]="true"
                [showClear]="true">
              </p-multiSelect>
            </div>
          </div>

          <!-- Attachments -->
          <div class="col-12">
            <div class="field">
              <label>Attachments</label>
              <p-fileUpload
                mode="basic"
                chooseLabel="Upload Files"
                [multiple]="true"
                accept="image/*,application/pdf"
                [maxFileSize]="5000000"
                (onSelect)="onFileSelect($event)">
              </p-fileUpload>
              <small class="text-500">Max file size: 5MB. Allowed types: Images, PDF</small>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-content-end gap-2 mt-4">
          <button 
            pButton 
            type="button" 
            label="Cancel" 
            class="p-button-text"
            (click)="onCancel()">
          </button>
          <button 
            pButton 
            type="submit" 
            [label]="isEditMode ? 'Update Job' : 'Post Job'"
            [loading]="loading"
            [disabled]="jobForm.invalid || loading">
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputtext.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
      .p-calendar.ng-invalid.ng-touched .p-inputtext {
        border-color: var(--red-500);
      }
      .p-inputnumber.ng-invalid.ng-touched .p-inputtext {
        border-color: var(--red-500);
      }
    }
  `]
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  loading = false;
  minDate = new Date();
  selectedFiles: File[] = [];

  availableSkills = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'PHP', value: 'php' },
    { label: 'Swift', value: 'swift' },
    { label: 'Kotlin', value: 'kotlin' },
    { label: 'React', value: 'react' },
    { label: 'Angular', value: 'angular' },
    { label: 'Vue.js', value: 'vue' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Django', value: 'django' },
    { label: 'Flask', value: 'flask' },
    { label: 'Spring Boot', value: 'spring-boot' },
    { label: 'Docker', value: 'docker' },
    { label: 'Kubernetes', value: 'kubernetes' },
    { label: 'AWS', value: 'aws' },
    { label: 'Azure', value: 'azure' },
    { label: 'GCP', value: 'gcp' },
    { label: 'UI/UX Design', value: 'ui-ux' },
    { label: 'Graphic Design', value: 'graphic-design' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Machine Learning', value: 'machine-learning' },
    { label: 'Data Science', value: 'data-science' },
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Mobile Development', value: 'mobile' },
    { label: 'Web Development', value: 'web' },
    { label: 'Database', value: 'database' },
    { label: 'Testing/QA', value: 'testing' }
  ];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    // Set minimum date to today
    this.minDate.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    this.initForm();

    // Check if we're in edit mode
    const jobId = this.route.snapshot.params['id'];
    if (jobId) {
      this.isEditMode = true;
      this.loadJob(jobId);
    }
  }

  initForm() {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      budget: [null, [Validators.required, Validators.min(1)]],
      deadline: [null, [Validators.required, this.futureDateValidator()]],
      location: [''],
      skills_required: [[]],
      attachments: [null]
    });
  }

  loadJob(id: number) {
    this.loading = true;
    this.jobService.getJob(id).subscribe({
      next: (job) => {
        // Convert deadline string to Date object
        const jobData = {
          ...job,
          deadline: job.deadline ? new Date(job.deadline) : null
        };
        this.jobForm.patchValue(jobData);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load job details'
        });
        this.loading = false;
        this.router.navigate(['/dashboard/jobs']);
      }
    });
  }

  onSubmit() {
    if (this.jobForm.valid) {
      this.loading = true;
      const formData = this.jobForm.value;

      // Convert deadline to ISO string
      if (formData.deadline) {
        formData.deadline = formData.deadline.toISOString();
      }

      // Handle file uploads if needed
      if (this.selectedFiles.length > 0) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (key !== 'attachments') {
            formDataObj.append(key, formData[key]);
          }
        });
        this.selectedFiles.forEach((file, index) => {
          formDataObj.append(`attachment_${index}`, file);
        });
        formData.attachments = formDataObj;
      }

      const request$ = this.isEditMode
        ? this.jobService.updateJob(this.route.snapshot.params['id'], formData)
        : this.jobService.createJob(formData);

      request$.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Job ${this.isEditMode ? 'updated' : 'created'} successfully`
          });
          this.loading = false;
          this.router.navigate(['/dashboard/jobs']);
        },
        error: (error) => {
          console.error('Error saving job:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${this.isEditMode ? 'update' : 'create'} job`
          });
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.jobForm.controls).forEach(key => {
        const control = this.jobForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/jobs']);
  }

  onFileSelect(event: any) {
    this.selectedFiles = event.files;
  }

  private futureDateValidator() {
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      const date = new Date(control.value);
      const now = new Date();
      return date > now ? null : { pastDate: true };
    };
  }
} 