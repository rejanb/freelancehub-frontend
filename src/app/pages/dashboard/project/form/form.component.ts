import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from 'primeng/button';
import {Calendar} from 'primeng/calendar';
import {Checkbox} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {FileUpload} from 'primeng/fileupload';
import {InputText} from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ProjectService } from '../../../../../service/project.service';
import {Textarea} from 'primeng/textarea';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonDirective,
    Calendar,
    Checkbox,
    DropdownModule,
    FileUpload,
    InputText,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    Textarea,
    ToastModule,
    InputNumberModule
  ],
  providers: [MessageService],
  template: `
    <div class="project-form-container">
      <p-toast></p-toast>
      
      <!-- Header -->
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold m-0">
          {{ isEditMode ? 'Edit Project' : 'Create New Project' }}
        </h2>
        <button pButton 
                label="Back to Projects" 
                icon="pi pi-arrow-left" 
                class="p-button-outlined"
                (click)="goBack()">
        </button>
      </div>

      <!-- Form -->
      <div class="card">
        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <div class="grid">
            <!-- Title -->
            <div class="col-12">
              <label for="title" class="block text-900 font-medium mb-2">Project Title *</label>
              <input pInputText 
                     id="title" 
                     formControlName="title" 
                     class="w-full"
                     placeholder="Enter project title"
                     [class.ng-invalid]="projectForm.get('title')?.invalid && projectForm.get('title')?.touched">
              <small class="p-error" *ngIf="projectForm.get('title')?.invalid && projectForm.get('title')?.touched">
                Project title is required
              </small>
            </div>

            <!-- Description -->
            <div class="col-12">
              <label for="description" class="block text-900 font-medium mb-2">Description *</label>
              <textarea pInputTextarea 
                        id="description" 
                        formControlName="description" 
                        rows="6" 
                        class="w-full"
                        placeholder="Provide detailed project description..."
                        [class.ng-invalid]="projectForm.get('description')?.invalid && projectForm.get('description')?.touched">
              </textarea>
              <small class="p-error" *ngIf="projectForm.get('description')?.invalid && projectForm.get('description')?.touched">
                Project description is required
              </small>
            </div>

            <!-- Budget and Deadline -->
            <div class="col-12 md:col-6">
              <label for="budget" class="block text-900 font-medium mb-2">Budget (\$) *</label>
              <p-inputNumber id="budget" 
                             formControlName="budget" 
                             mode="currency" 
                             currency="USD" 
                             locale="en-US"
                             class="w-full"
                             [min]="1"
                             placeholder="0.00"
                             [class.ng-invalid]="projectForm.get('budget')?.invalid && projectForm.get('budget')?.touched">
              </p-inputNumber>
              <small class="p-error" *ngIf="projectForm.get('budget')?.invalid && projectForm.get('budget')?.touched">
                Budget is required
              </small>
            </div>

            <div class="col-12 md:col-6">
              <label for="deadline" class="block text-900 font-medium mb-2">Deadline *</label>
              <p-calendar id="deadline" 
                          formControlName="deadline" 
                          [showIcon]="true" 
                          [minDate]="minDate"
                          dateFormat="mm/dd/yy"
                          class="w-full"
                          placeholder="Select deadline"
                          [class.ng-invalid]="projectForm.get('deadline')?.invalid && projectForm.get('deadline')?.touched">
              </p-calendar>
              <small class="p-error" *ngIf="projectForm.get('deadline')?.invalid && projectForm.get('deadline')?.touched">
                Deadline is required
              </small>
            </div>

            <!-- Category and Location -->
            <div class="col-12 md:col-6">
              <label for="category" class="block text-900 font-medium mb-2">Category</label>
              <p-dropdown id="category" 
                          formControlName="category" 
                          [options]="categories" 
                          optionLabel="name" 
                          optionValue="id"
                          placeholder="Select category"
                          class="w-full"
                          [showClear]="true">
              </p-dropdown>
            </div>

            <div class="col-12 md:col-6">
              <label for="location" class="block text-900 font-medium mb-2">Location</label>
              <input pInputText 
                     id="location" 
                     formControlName="location" 
                     class="w-full"
                     placeholder="e.g., Remote, New York, London">
            </div>

            <!-- Skills Required -->
            <div class="col-12">
              <label for="skills" class="block text-900 font-medium mb-2">Skills Required</label>
              <input pInputText 
                     id="skills" 
                     formControlName="skills_required" 
                     class="w-full"
                     placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)">
              <small class="text-600">Separate multiple skills with commas</small>
            </div>

            <!-- Status (for edit mode) -->
            <div class="col-12 md:col-6" *ngIf="isEditMode">
              <label for="status" class="block text-900 font-medium mb-2">Status</label>
              <p-dropdown id="status" 
                          formControlName="status" 
                          [options]="statusOptions" 
                          optionLabel="label" 
                          optionValue="value"
                          class="w-full">
              </p-dropdown>
            </div>

            <!-- Public visibility -->
            <div class="col-12">
              <div class="flex align-items-center">
                <p-checkbox id="isPublic" 
                            formControlName="is_public" 
                            [binary]="true">
                </p-checkbox>
                <label for="isPublic" class="ml-2">Make this project publicly visible</label>
              </div>
              <small class="text-600">Public projects can be viewed by non-registered users</small>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 justify-content-end mt-4">
            <button pButton 
                    label="Cancel" 
                    type="button"
                    class="p-button-outlined" 
                    (click)="goBack()">
            </button>
            <button pButton 
                    [label]="isEditMode ? 'Update Project' : 'Create Project'"
                    type="submit"
                    [disabled]="projectForm.invalid || submitting"
                    [loading]="submitting">
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode = false;
  projectId: string | null = null;
  submitting = false;
  minDate = new Date();

  statusOptions = [
    {label: 'Open', value: 'open'},
    {label: 'In Progress', value: 'in_progress'},
    {label: 'Completed', value: 'completed'},
    {label: 'Cancelled', value: 'cancelled'}
  ];
  
  categories: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCategories();
    
    // Check if editing existing project
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = params['id'];
        this.loadProject();
      }
    });
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      budget: [null, [Validators.required, Validators.min(1)]],
      deadline: [null, Validators.required],
      category: [null],
      location: [''],
      skills_required: [''],
      status: ['open'],
      is_public: [true]
    });
  }

  loadCategories() {
    this.projectService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProject() {
    if (!this.projectId) return;
    
    this.projectService.getProject(this.projectId).subscribe({
      next: (project) => {
        // Convert skills array to comma-separated string for display
        const skillsString = Array.isArray(project.skills_required) 
          ? project.skills_required.join(', ') 
          : project.skills_required || '';
          
        this.projectForm.patchValue({
          title: project.title,
          description: project.description,
          budget: project.budget,
          deadline: new Date(project.deadline),
          category: project.category?.id,
          location: project.location,
          skills_required: skillsString,
          status: project.status,
          is_public: project.is_public
        });
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load project details'
        });
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.submitting = true;
    const formData = this.prepareFormData();

    const operation = this.isEditMode 
      ? this.projectService.updateProject(this.projectId!, formData)
      : this.projectService.createProject(formData);

    operation.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Project ${this.isEditMode ? 'updated' : 'created'} successfully!`
        });
        setTimeout(() => this.goBack(), 1500);
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error saving project:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || `Failed to ${this.isEditMode ? 'update' : 'create'} project`
        });
        this.submitting = false;
      }
    });
  }

  prepareFormData() {
    const formValue = this.projectForm.value;
    
    // Convert skills string to array
    const skillsArray = formValue.skills_required 
      ? formValue.skills_required.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill)
      : [];

    return {
      ...formValue,
      skills_required: skillsArray,
      category: formValue.category || null
    };
  }

  markFormGroupTouched() {
    Object.keys(this.projectForm.controls).forEach(field => {
      const control = this.projectForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
