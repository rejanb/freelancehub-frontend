import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { JobService } from '@/app/service/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="table-auto w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border">Title</th>
          <th class="px-4 py-2 border">Budget</th>
          <th class="px-4 py-2 border">Deadline</th>
          <th class="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let job of jobs">
          <td class="px-4 py-2 border">{{ job.title }}</td>
          <td class="px-4 py-2 border">{{ job.budget }}</td>
          <td class="px-4 py-2 border">{{ job.deadline | date }}</td>
          <td class="px-4 py-2 border space-x-2">
            <button class="p-button p-button-info" (click)="edit.emit(job)">Edit</button>
            <button class="p-button p-button-danger" (click)="deleteJob(job.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class JobTableComponent implements OnChanges {
  @Input() refreshKey: number = 0;
  @Output() edit = new EventEmitter<any>();

  jobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnChanges() {
    this.jobService.getJobs().subscribe(data => {
      this.jobs = data;
    });
  }

  deleteJob(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(id).subscribe(() => {
        this.ngOnChanges(); // reload table
      });
    }
  }
}
