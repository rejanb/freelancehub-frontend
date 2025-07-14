import { Routes } from '@angular/router';
import {LoginComponent} from './pages/auth/login/login.component';
import {dashboardRoutes} from './pages/dashboard/dashboard.routes';
import {authRoutes} from './pages/auth/auth.routes';
import {UnauthComponent} from './components/unauth/unauth.component';
import {loginGuard} from './guards/login.guard';
import {authGuard} from './guards/auth.guard';
import {RegisterComponent} from './pages/auth/register/register.component';
import {HomeComponent} from './pages/home/home.component';


export const routes: Routes = [
  { path: 'dashboard', children: dashboardRoutes, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'unauth', component: UnauthComponent },
  { path: 'register', component: RegisterComponent }, // Public route
  { path: 'home', component: HomeComponent }, // Public route
  { path: '**', redirectTo: '/unauth' }
];
