import { Routes } from '@angular/router';
import {LoginComponent} from './pages/auth/login/login.component';
import {dashboardRoutes} from './pages/dashboard/dashboard.routes';
import {authRoutes} from './pages/auth/auth.routes';
import {UnauthComponent} from './components/unauth/unauth.component';
import {loginGuard} from './guards/login.guard';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
    { path: 'dashboard', children: dashboardRoutes, canActivate:[authGuard] },
    { path: 'login', component: LoginComponent ,canActivate: [loginGuard]},
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'unauth', component: UnauthComponent},
    { path: '**', redirectTo: '/unauth'}
];
