import { Routes } from '@angular/router';
import {ReviewDetailComponent} from './review-detail/review-detail.component';
import {ReviewFormComponent} from './review-form/review-form.component';
import {ReviewListComponent} from './review-list/review-list.component';

export const reviewsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ReviewListComponent
      },
      {
        path: 'create/:contractId',
        component: ReviewFormComponent
      },
      {
        path: ':id',
        component: ReviewDetailComponent
      }
    ]
  }
];
