import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

function isApiRequest(req: HttpRequest<unknown>): boolean {
  return req.url.startsWith('/api/');
}

function authorized(
  auth: AuthService,
  router: Router,
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
    catchError((error: HttpErrorResponse) =>
      retryOnUnauthorized(auth, router, req, next, attempt, error)
    )
  );
}

function retryOnUnauthorized(
  auth: AuthService,
  router: Router,
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
        void router.navigate(['/login']);
        return throwError(() => error);
      }
      return authorized(auth, router, req, next, attempt + 1);
    })
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!isApiRequest(req)) {
    return next(req);
  }
  return authorized(auth, router, req, next, 0);
};
