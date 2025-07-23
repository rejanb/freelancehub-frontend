import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../utils/token.service';
import { RouteConst } from '../const/api-const';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const currentUser = tokenService.getCurrentUser();
  const accessToken = localStorage.getItem('access');

  // Check if user exists and has valid token
  if (currentUser && accessToken) {
    // Check if token is expired (basic check - you might want to add JWT decode)
    try {
      // For now, just check if token exists
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      tokenService.clearLocal('access');
      tokenService.clearLocal('refresh');
      tokenService.clearLocal('user');
      router.navigateByUrl(RouteConst.LOGIN);
      return false;
    }
  }

  // Redirect to login if not authenticated
  router.navigateByUrl(RouteConst.LOGIN);
  return false;
};
