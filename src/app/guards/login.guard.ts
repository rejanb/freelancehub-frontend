import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {TokenService} from '../utils/token.service';

export const loginGuard: CanActivateFn = (route, state) => {

  const token= inject(TokenService)
  const router= inject(Router)
  const currentUser = token.getCurrentUser();
  const tokens = token.getToken();
  if(!tokens){
    return true
  }
  if(currentUser.type =='caller'){
    router.navigateByUrl('/dashboard');
  }else{
    router.navigate(['dashboard']);
    // this.router.navigateByUrl('/leads/student-list');
  }
  return true;

};
