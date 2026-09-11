import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function isApiRequest(req: HttpRequest<unknown>): boolean {
  return req.url.startsWith('/api/');
}

function authorized(
  auth: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  attempt: number
): Observable<HttpEvent<unknown>> {
  return from(auth.restoreSession()).pipe(
    switchMap((ok) => {
      if (!ok || !auth.isAuthenticated) {
        return next(req);
      }
      const authorizedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
      });
      return next(authorizedRequest);
    }),
    catchError((error: HttpErrorResponse) => retryOnUnauthorized(auth, req, next, attempt, error))
  );
}

function retryOnUnauthorized(
  auth: AuthService,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  attempt: number,
  error: HttpErrorResponse
): Observable<HttpEvent<unknown>> {
  if (attempt >= 1 || error.status !== 401 || !auth.hasRefreshToken) {
    return throwError(() => error);
  }

  return from(auth.restoreSession(true)).pipe(
    switchMap((refreshed) => {
      if (!refreshed) {
        void auth.startLogin();
        return throwError(() => error);
      }
      return authorized(auth, req, next, attempt + 1);
    })
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (!isApiRequest(req)) {
    return next(req);
  }
  return authorized(auth, req, next, 0);
};
