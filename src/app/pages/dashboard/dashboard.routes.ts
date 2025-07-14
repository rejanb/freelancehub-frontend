import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {OverviewComponent} from './overview/overview.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
]
