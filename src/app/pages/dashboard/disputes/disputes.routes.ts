import { Routes } from '@angular/router';
import {DisputeDetailComponent} from './dispute-detail/dispute-detail.component';
import {DisputeFormComponent} from './dispute-form/dispute-form.component';
import {DisputeListComponent} from './dispute-list/dispute-list.component';

export const disputesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DisputeListComponent
      },
      {
        path: 'create/:contractId',
        component: DisputeFormComponent
      },
      {
        path: 'detail:id',
        component: DisputeDetailComponent
      }
    ]
  }
];
