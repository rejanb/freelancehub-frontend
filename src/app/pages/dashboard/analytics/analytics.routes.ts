import { Routes } from '@angular/router';

export const analyticsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./analytics-dashboard/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent)
      },

    ]
  }
];
// {
//   path: 'earnings',
//   loadComponent: () => import('./earnings-analytics/earnings-analytics.component').then(m => m.EarningsAnalyticsComponent)
// },
// {
//   path: 'jobs',
//   loadComponent: () => import('./job-analytics/job-analytics.component').then(m => m.JobAnalyticsComponent)
// },
// {
//   path: 'proposals',
//   loadComponent: () => import('./proposal-analytics/proposal-analytics.component').then(m => m.ProposalAnalyticsComponent)
// },
// {
//   path: 'contracts',
//   loadComponent: () => import('./contract-analytics/contract-analytics.component').then(m => m.ContractAnalyticsComponent)
// },
// {
//   path: 'performance',
//   loadComponent: () => import('./performance-analytics/performance-analytics.component').then(m => m.PerformanceAnalyticsComponent)
// }
