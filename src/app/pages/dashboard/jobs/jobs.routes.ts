import { Routes } from '@angular/router';
import { clientGuard } from '../../../guards/client.guard';
import {JobListComponent} from './job-list/job-list.component';
import {JobFormComponent} from './job-form/job-form.component';
import {JobDetailComponent} from './job-detail/job-detail.component';
import {JobProposalsComponent} from './job-proposals/job-proposals.component';

export const jobsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: JobListComponent
      },
      {
        path: 'add',
        component: JobFormComponent,
        // canActivate: [clientGuard]
      },
      {
        path: 'edit/:id',
        component: JobFormComponent,
        // canActivate: [clientGuard]
      },
      {
        path: ':id',
        component:JobDetailComponent,
      },
      {
        path: ':id/proposals',
        component: JobProposalsComponent,
        // canActivate: [clientGuard]
      }
    ]
  }
];
