import { Routes } from '@angular/router';
import {LoginComponent} from './pages/auth/login/login.component';
import {dashboardRoutes} from './pages/dashboard/dashboard.routes';
import {authRoutes} from './pages/auth/auth.routes';
import {UnauthComponent} from './components/unauth/unauth.component';
import {loginGuard} from './guards/login.guard';
import {authGuard} from './guards/auth.guard';
import {RegisterComponent} from './pages/auth/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {jobsRoutes} from './pages/dashboard/jobs/jobs.routes';
import {PublicJobsComponent} from './pages/public/jobs/public-jobs.component';
import {PublicProjectsComponent} from './pages/public/projects/public-projects.component';
import {PublicJobDetailComponent} from './pages/public/jobs/public-job-detail.component';
import {PublicProjectDetailComponent} from './pages/public/projects/public-project-detail.component';
import {RatingsComponent} from './pages/ratings/ratings.component';


export const routes: Routes = [
  { path: 'dashboard', children: dashboardRoutes, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', component: UnauthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'job', children: jobsRoutes, canActivate: [authGuard] },
  { path: 'ratings', component: RatingsComponent, canActivate: [authGuard] },
  // Public routes for browsing
  { path: 'jobs', component: PublicJobsComponent },
  { path: 'jobs/:id', component: PublicJobDetailComponent },
  { path: 'projects', component: PublicProjectsComponent },
  { path: 'projects/:id', component: PublicProjectDetailComponent },
  { path: '**', redirectTo: '/404' }
];
