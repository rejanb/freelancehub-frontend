import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {TokenService} from '../utils/token.service';
import { ApiConst } from '../const/api-const';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
let isRefreshing = false;
let refreshToken$: Observable<any> | null = null;

// export const tokenInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
//   console.log('Token Interceptor triggered');
//
//
//
//   // console.log('Token Interceptor is running');
//   // const tokenService = inject(AuthService);
//   // const token = tokenService.getAccessToken()
//   // console.log('Token:', token);
//   //
//   // if (token) {
//   //   req = req.clone({
//   //     setHeaders: { Authorization: `Bearer ${token}` }
//   //   });
//   // }
//   // console.log('Intercepted request:', req);
//   // return next(req);
//
//   const authService = inject(AuthService);
//
//   const accessToken = authService.getAccessToken();
//
//   if (req.url.includes('/auth/refresh')) {
//     return next(req);
//   }
//
//   const authReq = accessToken
//     ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
//     : req;
//
//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         if (!isRefreshing) {
//           isRefreshing = true;
//           refreshToken$ = authService.refreshToken().pipe(
//             switchMap((token) => {
//               isRefreshing = false;
//               authService.setAccessToken(token.access);
//               return next(
//                 req.clone({ setHeaders: { Authorization: `Bearer ${token.access}` } })
//               );
//             }),
//             catchError((err) => {
//               isRefreshing = false;
//               authService.logout();
//               return throwError(() => err);
//             })
//           );
//           return refreshToken$;
//         } else {
//           return refreshToken$.pipe(
//             filter(token => !!token),
//             take(1),
//             switchMap((token: any) =>
//               next(req.clone({ setHeaders: { Authorization: `Bearer ${token.access}` } }))
//             )
//           );
//         }
//       }
//       return throwError(() => error);
//     })
//   );
// };



export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  console.log('Token Interceptor triggered');

  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const authReq = accessToken
    ? req.clone({setHeaders: {Authorization: `Bearer ${accessToken}`}})
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshToken$ = authService.refreshToken().pipe(
            switchMap((token) => {
              isRefreshing = false;
              authService.setAccessToken(token.access);
              return next(
                req.clone({setHeaders: {Authorization: `Bearer ${token.access}`}})
              );
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
          return refreshToken$ as Observable<HttpEvent<unknown>>;
        } else {
          return refreshToken$!.pipe(
            filter(token => !!token),
            take(1),
            switchMap((token: any) =>
              next(req.clone({setHeaders: {Authorization: `Bearer ${token.access}`}}))
            )
          ) as Observable<HttpEvent<unknown>>;
        }
      }
      return throwError(() => error) as Observable<HttpEvent<unknown>>;
    })
  );
}
