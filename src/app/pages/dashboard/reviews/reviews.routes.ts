import { Routes } from '@angular/router';

export const reviewsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./review-list/review-list.component').then(m => m.ReviewListComponent)
      },
      {
        path: 'create/:contractId',
        loadComponent: () => import('./review-form/review-form.component').then(m => m.ReviewFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./review-detail/review-detail.component').then(m => m.ReviewDetailComponent)
      }
    ]
  }
]; 