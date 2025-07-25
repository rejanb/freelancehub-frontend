import { Routes } from '@angular/router';
import {DisputeDetailComponent} from './dispute-detail/dispute-detail.component';
import {DisputeFormComponent} from './dispute-form/dispute-form.component';
import {DisputeListComponent} from './dispute-list/dispute-list.component';
import {SimpleDisputeFormComponent} from './simple-dispute-form/simple-dispute-form.component';

export const disputesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DisputeListComponent
      },
      {
        path: 'create',
        component: SimpleDisputeFormComponent
      },
      {
        path: 'create/:contractId',
        component: SimpleDisputeFormComponent
      },
      {
        path: 'form/:contractId',
        component: DisputeFormComponent
      },
      {
        path: 'detail/:id',
        component: DisputeDetailComponent
      },
      {
        path: ':id',
        component: DisputeDetailComponent
      }
    ]
  }
];
