import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../utils/token.service';
import {RoleConst} from '../const/api-const';

export const freelancerGuard: CanActivateFn = (route, state) => {
  const token= inject(TokenService)
  const router= inject(Router)
  const currentUser = token.getCurrentUser()

  if(currentUser.type === RoleConst.FREELANCER)  {
    return true
  }
  router.navigateByUrl('/404 ');
  return false;
};
