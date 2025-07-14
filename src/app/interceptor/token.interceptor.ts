import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {TokenService} from '../utils/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log('Token Interceptor is running');
  // const authService = inject(TokenService);
  // const token = authService.getLocal('authToken');
  //   req = req.clone({
  //       setHeaders: { Authorization: `Token ${token}` }
  //     });
  return next(req);
};
