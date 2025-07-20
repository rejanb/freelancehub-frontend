import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {TokenService} from '../utils/token.service';
import { ApiConst } from '../const/api-const';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {throwError} from 'rxjs';
let isRefreshing = false;
let refreshToken$: any = null;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Token Interceptor triggered');



  console.log('Token Interceptor is running');
  const tokenService = inject(TokenService);
  const token = tokenService.getLocal(ApiConst.tokenKey) as any;
  console.log('Token:', token?.access);

  if (token?.access) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token.access}` }
    });
  }
  console.log('Intercepted request:', req);
  return next(req);

  // const authService = inject(AuthService);
  //
  // const accessToken = authService.getAccessToken();

  // Skip refresh token endpoint to avoid infinite loop
  // if (req.url.includes('/auth/refresh')) {
  //   return next(req);
  // }
  //
  // const authReq = accessToken
  //   ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
  //   : req;
  //
  // return next(authReq).pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401) {
  //       if (!isRefreshing) {
  //         isRefreshing = true;
  //         refreshToken$ = authService.refreshToken().pipe(
  //           switchMap((token) => {
  //             isRefreshing = false;
  //             authService.setAccessToken(token.access);
  //             return next(
  //               req.clone({ setHeaders: { Authorization: `Bearer ${token.access}` } })
  //             );
  //           }),
  //           catchError((err) => {
  //             isRefreshing = false;
  //             authService.logout();
  //             return throwError(() => err);
  //           })
  //         );
  //         return refreshToken$;
  //       } else {
  //         return refreshToken$.pipe(
  //           filter(token => !!token),
  //           take(1),
  //           switchMap((token: any) =>
  //             next(req.clone({ setHeaders: { Authorization: `Bearer ${token.access}` } }))
  //           )
  //         );
  //       }
  //     }
  //     return throwError(() => error);
  //   })
  // );
};
