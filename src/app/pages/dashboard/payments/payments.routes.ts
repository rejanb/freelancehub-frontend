import { Routes } from '@angular/router';
import { freelancerGuard } from '../../../guards/freelancer.guard';
import { clientGuard } from '../../../guards/client.guard';

export const paymentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/payment-dashboard.component').then(m => m.PaymentDashboardComponent)
      },
      {
        path: 'pay',
        loadComponent: () => import('./pay/pay-project.component').then(m => m.PayProjectComponent),
        canActivate: [clientGuard]
      },
      {
        path: 'withdraw',
        loadComponent: () => import('./withdraw/withdraw.component').then(m => m.WithdrawComponent),
        canActivate: [freelancerGuard]
      },
      {
        path: 'history',
        loadComponent: () => import('./history/payment-history.component').then(m => m.PaymentHistoryComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./payment-detail/payment-detail.component').then(m => m.PaymentDetailComponent)
      }
    ]
  }
]; 