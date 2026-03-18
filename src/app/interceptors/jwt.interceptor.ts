import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const token = storageService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('auth/login')) {
        const refreshToken = storageService.getRefreshToken();
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((response: any) => {
              if (response.success) {
                storageService.saveToken(response.token);
                storageService.saveRefreshToken(response.refreshToken);
                
                // Retry the failed request with the new token
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`
                  }
                });
                return next(retryReq);
              }
              
              // Refresh failed, logout
              storageService.clean();
              authService.updateAuthStatus(false);
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              storageService.clean();
              authService.updateAuthStatus(false);
              return throwError(() => refreshError);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
