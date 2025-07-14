import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {BaseComponent} from './base/base.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
]
