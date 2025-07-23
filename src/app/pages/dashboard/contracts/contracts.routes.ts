import { Routes } from '@angular/router';
import {MilestoneListComponent} from './milestone-list/milestone-list.component';
import {ContractListComponent} from './contract-list/contract-list.component';
import {ContractDetailComponent} from './contract-detail/contract-detail.component';

export const contractsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: ContractListComponent
      },
      {
        path: ':id',
        component: ContractDetailComponent
      },
      {
        path: ':id/milestones',
        component:MilestoneListComponent
      }
    ]
  }
];
