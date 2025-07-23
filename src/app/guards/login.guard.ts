import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../utils/token.service';
import { RouteConst } from '../const/api-const';

export const loginGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const currentUser = tokenService.getCurrentUser();
  const accessToken = localStorage.getItem('access');

  // If user is not authenticated, allow access to login page
  if (!currentUser || !accessToken) {
    return true;
  }

  // If user is already authenticated, redirect to dashboard
  router.navigateByUrl(RouteConst.DASHBOARD);
  return false;
};
