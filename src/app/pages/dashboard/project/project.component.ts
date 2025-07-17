import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {CalendarModule} from 'primeng/calendar';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,

    // PrimeNG Modules
    InputTextModule,
    TextareaModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    FileUploadModule,
    ButtonModule,
    PasswordModule,],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  projectForm!: FormGroup;
  statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' }
  ];
  categories = []; // Load from API
  clients = []; // Load from API
  freelancers = []; // Load from API

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      budget: [null, Validators.required],
      deadline: [null, Validators.required],
      status: ['open'],
      category: [null],
      client: [null, Validators.required],
      selected_freelancer: [null],
      location: [''],
      tags: [''],
      skills_required: [''],
      is_public: [true],
      is_featured: [false],
      completed_at: [null],
      attachments: [null]
    });
    // Load categories, clients, freelancers from API here
  }

  onFileUpload(event: any) {
    // Handle file upload logic
    this.projectForm.patchValue({ attachments: event.files[0] });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formValue = { ...this.projectForm.value };
      // Convert tags and skills_required to arrays
      formValue.tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];
      formValue.skills_required = formValue.skills_required ? formValue.skills_required.split(',').map((s: string) => s.trim()) : [];
      // Send formValue to API for create/update
    }
  }
}
