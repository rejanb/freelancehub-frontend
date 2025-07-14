import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../utils/token.service';

export const authGuard: CanActivateFn = (route, state) => {


  const token= inject(TokenService)
  const router= inject(Router)
  const currentUser = token.getCurrentUser()
  if(currentUser){
    return true
  }
  router.navigateByUrl('/login').then();
  return false;
};
