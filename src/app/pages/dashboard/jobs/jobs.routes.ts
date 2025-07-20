import { Routes } from '@angular/router';
import { clientGuard } from '../../../guards/client.guard';

export const jobsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./job-list/job-list.component').then(m => m.JobListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent),
        canActivate: [clientGuard]
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent),
        canActivate: [clientGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./job-detail/job-detail.component').then(m => m.JobDetailComponent)
      },
      {
        path: ':id/proposals',
        loadComponent: () => import('./job-proposals/job-proposals.component').then(m => m.JobProposalsComponent),
        canActivate: [clientGuard]
      }
    ]
  }
]; 