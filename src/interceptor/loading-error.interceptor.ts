import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs';
import { LoadingService } from '../service/loading.service';

export const LoadingErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Optionally, show a toast or dialog here
      return throwError(() => error);
    }),
    finalize(() => {
      loadingService.hide();
    })
  );
};
