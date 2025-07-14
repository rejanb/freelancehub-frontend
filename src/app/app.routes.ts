import { Routes } from '@angular/router';
import {LoginComponent} from './pages/auth/login/login.component';
import {dashboardRoutes} from './pages/dashboard/dashboard.routes';
import {authRoutes} from './pages/auth/auth.routes';

export const routes: Routes = [
    { path: 'auth', children: authRoutes },
    { path: 'dashboard', children: dashboardRoutes },
  { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];
