import { Routes } from '@angular/router';
import { freelancerGuard } from '../../../guards/freelancer.guard';

export const paymentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./payment-list/payment-list.component').then(m => m.PaymentListComponent)
      },
      {
        path: 'withdraw',
        loadComponent: () => import('./withdraw/withdraw.component').then(m => m.WithdrawComponent),
        canActivate: [freelancerGuard]
      },
      {
        path: ':id',
        loadComponent: () => import('./payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent)
      }
    ]
  }
]; 