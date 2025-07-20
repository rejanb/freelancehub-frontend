import { Routes } from '@angular/router';

export const contractsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./contract-list/contract-list.component').then(m => m.ContractListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./contract-detail/contract-detail.component').then(m => m.ContractDetailComponent)
      },
      {
        path: ':id/milestones',
        loadComponent: () => import('./milestone-list/milestone-list.component').then(m => m.MilestoneListComponent)
      }
    ]
  }
]; 