import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../utils/token.service';
import {ApiConst, RoleConst} from '../const/api-const';

export const clientGuard: CanActivateFn = (route, state) => {
  const token= inject(TokenService)
  console.log('yo')
  const router= inject(Router)
  const currentUser = token.getCurrentUser()

  if(currentUser.type === RoleConst.CLIENT)  {
    return true
  }
  router.navigateByUrl('/404 ');
  return false;
};
