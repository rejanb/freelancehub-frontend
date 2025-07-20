import { Routes } from '@angular/router';

export const disputesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./dispute-list/dispute-list.component').then(m => m.DisputeListComponent)
      },
      {
        path: 'create/:contractId',
        loadComponent: () => import('./dispute-form/dispute-form.component').then(m => m.DisputeFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./dispute-detail/dispute-detail.component').then(m => m.DisputeDetailComponent)
      }
    ]
  }
]; 