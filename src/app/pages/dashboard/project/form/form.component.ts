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
import { LoadingService } from '../../../../../service/loading.service';
import {Textarea} from 'primeng/textarea';
import {AsyncPipe, CommonModule} from '@angular/common';
import {Observable} from 'rxjs';
import {LoadingComponent} from '../../../../components/loading/loading.component';
import {ActivatedRoute} from '@angular/router';

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
    LoadingComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})


export class FormComponent implements OnInit {
  projectForm!: FormGroup;

  statusOptions = [
    {label: 'Open', value: 'open'},
    {label: 'In Progress', value: 'in_progress'},
    {label: 'Completed', value: 'completed'}
  ];
  categories: any[] = []; // Load from API
  projects: any[] = [];
  loading$!: Observable<boolean>;
  header: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private loadingService: LoadingService
  ) {
     this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {

      if (this.route.snapshot.routeConfig?.path?.includes('add')) {
      this.header = 'Add';
    } else {
      this.header = history.state.header || '';
    }

        console.log('Mll' + this.header);
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      budget: [null, Validators.required],
      deadline: [null, Validators.required],
      status: ['open'],
      category: [null],
      location: [''],
      skills_required: [''],
      is_public: [true],
      is_featured: [false],
      attachments: [null]
    });


    
    // Show loader
    // this.loadingService.show();
    this.projectService.getCategories().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.categories = data;
        } else if (data && Array.isArray(data.results)) {
          this.categories = data.results;
        } else {
          this.categories = [];
        }
      },
      error: (err: any) => {
        // this.loadingService.hide();
        // Handle error, e.g. show a toast or message
        console.error('Failed to load categories', err);
      }
    });
  }

  onFileUpload(event: any) {
    // Handle file upload logic
    this.projectForm.patchValue({attachments: event.files[0]});
  }

  show() {
    this.loadingService.show();
  }
  hide() {
    this.loadingService.hide();
  }
  // onSubmit() {
  //   if (this.projectForm.valid) {
  //     const formValue = {...this.projectForm.value};
  //     // Convert tags and skills_required to arrays
  //     formValue.tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];
  //     formValue.skills_required = formValue.skills_required ? formValue.skills_required.split(',').map((s: string) => s.trim()) : [];
  //     // Send formValue to API for create/update
  //   }
  // }

  onSubmit() {
    // if (this.projectForm.valid) {
      const formValue = {...this.projectForm.value};
      formValue.tags = formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [];
      formValue.skills_required = formValue.skills_required ? formValue.skills_required.split(',').map((s: string) => s.trim()) : [];
      this.projectService.createProject(formValue).subscribe({
        next: (result) => {
          // this.loadingService.hide();
          // Handle success (e.g. show message, navigate)
        },
        error: (err) => {
          // this.loadingService.hide();
          // Handle error (e.g. show toast)
        }
      });
    // }
  }
}
