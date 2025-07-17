import {Routes} from '@angular/router';
import {LayoutComponent} from './layout/layout.component';
import {OverviewComponent} from './overview/overview.component';
import {ProjectComponent} from './project/project.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'project', component: ProjectComponent },
      { path: '', redirectTo: 'project', pathMatch: 'full' }
    ]
  }
]
