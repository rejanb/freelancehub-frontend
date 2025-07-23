import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../utils/token.service';
import { RoleConst, RouteConst } from '../const/api-const';

export const clientGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const currentUser = tokenService.getCurrentUser();

  // Check if user exists and is authenticated
  if (!currentUser) {
    router.navigateByUrl(RouteConst.LOGIN);
    return false;
  }

  // Check if user is a client
  if (currentUser.type === RoleConst.CLIENT) {
    return true;
  }

  // If not a client, redirect to unauthorized page
  router.navigateByUrl(RouteConst.UNAUTHORIZED);
  return false;
};
