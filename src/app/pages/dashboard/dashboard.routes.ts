import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {OverviewComponent} from './overview/overview.component';
import {ClientDashboardComponent} from './client-dashboard/client-dashboard.component';
import {FreelancerDashboardComponent} from './freelancer-dashboard/freelancer-dashboard.component';
import {ProjectComponent} from './project/project.component';
import {ProjectDetailComponent} from './project/project-detail/project-detail.component';
import {FormComponent as ProjectFormComponent} from './project/form/project-form.component';
import {ProjectListComponent} from './project/project-list/project-list.component';
import {ProjectProposalsComponent} from './project/project-proposals/project-proposals.component';
import {jobsRoutes} from './jobs/jobs.routes';
import {authGuard} from '../../guards/auth.guard';
import {reviewsRoutes} from './reviews/reviews.routes';
import {ProfileComponent} from './profile/profile.component';
import {messagesRoutes} from './messages/messages.routes';
import {notificationsRoutes} from './notifications/notifications.routes';
import {disputesRoutes} from './disputes/disputes.routes';
import {contractsRoutes} from './contracts/contracts.routes';
import {paymentsRoutes} from './payments/payments.routes';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'freelancer-dashboard', component: FreelancerDashboardComponent },

      // Specialized Dashboards
      { path: 'client-dashboard', component: ClientDashboardComponent },
      // { path: 'freelancer-dashboard', component: FreelancerDashboardComponent },

      // Project routes
      { path: 'projects', component: ProjectListComponent },
      { path: 'projects/available', component: ProjectListComponent, data: { viewType: 'available' } }, //freelancer open projects
      { path: 'projects/my-projects', component: ProjectListComponent, data: { viewType: 'my' } }, //freelancer projects
      { path: 'projects/applications', component: ProjectListComponent, data: { viewType: 'applications' } }, // freelancer
      { path: 'projects/saved', component: ProjectListComponent, data: { viewType: 'saved' } }, //freelamcer
      { path: 'projects/form', component: ProjectFormComponent }, // add project
      { path: 'projects/form/:id', component: ProjectFormComponent }, // edit project
      { path: 'projects/:id/proposals', component: ProjectProposalsComponent }, // add proposal
      { path: 'projects/:id', component: ProjectDetailComponent }, //product detail


      { path: 'project', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'project/add', redirectTo: 'projects/form', pathMatch: 'full' },

      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'job', children: jobsRoutes, canActivate: [authGuard] },
      { path: 'review', children: reviewsRoutes, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'messages', children: messagesRoutes, canActivate: [authGuard] },
      { path: 'chat', children: messagesRoutes, canActivate: [authGuard] },
      { path: 'notification', children: notificationsRoutes, canActivate: [authGuard] },
      { path: 'dispute', children: disputesRoutes, canActivate: [authGuard] },
      { path: 'contract', children: contractsRoutes, canActivate: [authGuard] },
      { path: 'contracts', children: contractsRoutes, canActivate: [authGuard] },
      { path: 'payments', children: paymentsRoutes, canActivate: [authGuard] },
    ]
  }
]


// { path: 'project/add', component: FormComponent },
// {
//   path: 'profile',
//     loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
// },
// {
//   path: 'jobs',
//     children: jobsRoutes
// },
// {
//   path: 'contracts',
//     children: contractsRoutes
// },
// {
//   path: 'payments',
//     children: paymentsRoutes
// },
// {
//   path: 'messages',
//     children: messagesRoutes
// },
// {
//   path: 'reviews',
//     children: reviewsRoutes
// },
// {
//   path: 'notifications',
//     children: notificationsRoutes
// },
// {
//   path: 'analytics',
//     children: analyticsRoutes
// },
// {
//   path: 'disputes',
//     children: disputesRoutes
// },
// {
//   path: 'settings',
//     children: settingsRoutes
// },
// {
//   path: 'help',
//     children: helpRoutes
// },
// {
//   path: 'forum',
//     children: forumRoutes
// },
// { path: '', redirectTo: 'overview', pathMatch: 'full' }
// ]
