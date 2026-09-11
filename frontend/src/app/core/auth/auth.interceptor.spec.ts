import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let client: HttpClient;
  let authMock: {
    isAuthenticated: boolean;
    accessToken: string | null;
    hasRefreshToken: boolean;
    restoreSession: jasmine.Spy;
    logout: jasmine.Spy;
    startLogin: jasmine.Spy;
  };
  let get: (url: string) => Promise<unknown>;

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authMock },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    get = (url) => firstValueFrom(client.get(url));
  }

  beforeEach(() => {
    authMock = {
      isAuthenticated: true,
      accessToken: 'token-123',
      hasRefreshToken: true,
      restoreSession: jasmine.createSpy('restoreSession').and.returnValue(Promise.resolve(true)),
      logout: jasmine.createSpy('logout'),
      startLogin: jasmine.createSpy('startLogin').and.returnValue(Promise.resolve()),
    };
    setup();
  });

  afterEach(() => httpMock.verify());

  it('should attach the bearer token to API requests', async () => {
    const promise = get('/api/companies');
    await Promise.resolve();
    const req = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');
    req.flush({});
    await promise;
  });

  it('should refresh before attaching the token', async () => {
    const promise = get('/api/companies');
    await Promise.resolve();
    const req = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    expect(authMock.restoreSession).toHaveBeenCalled();
    req.flush({});
    await promise;
  });

  it('should not attach a token to non-API requests', async () => {
    const promise = get('/assets/config.json');
    const req = httpMock.expectOne((candidate) => candidate.url.includes('/assets/config.json'));
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    await promise;
  });

  it('should not attach a token when signed out', async () => {
    authMock.isAuthenticated = false;
    authMock.accessToken = null;
    const promise = get('/api/companies');
    await Promise.resolve();
    const req = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
    await promise;
  });

  it('should force a refresh and retry once after a 401', async () => {
    const promise = get('/api/companies');
    await Promise.resolve();

    const first = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    first.flush('', { status: 401, statusText: 'Unauthorized' });
    await Promise.resolve();

    expect(authMock.restoreSession).toHaveBeenCalledWith(true);
    expect(authMock.logout).not.toHaveBeenCalled();

    await Promise.resolve();
    const second = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    expect(second.request.headers.get('Authorization')).toBe('Bearer token-123');
    second.flush([{ id: 1 }]);

    expect(await promise).toEqual([{ id: 1 }]);
  });

  it('should propagate the error when a retried request is rejected again', async () => {
    const promise = get('/api/companies');
    await Promise.resolve();

    const first = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    first.flush('', { status: 401, statusText: 'Unauthorized' });
    await Promise.resolve();
    await Promise.resolve();

    const second = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    second.flush('', { status: 401, statusText: 'Unauthorized' });

    let error: unknown;
    try {
      await promise;
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(authMock.restoreSession).toHaveBeenCalledWith(true);
  });

  it('should end the session when the forced refresh fails and not retry', async () => {
    authMock.restoreSession.and.returnValues(Promise.resolve(true), Promise.resolve(false));
    const promise = get('/api/companies');
    await Promise.resolve();

    const req = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    req.flush('', { status: 401, statusText: 'Unauthorized' });
    await Promise.resolve();
    await Promise.resolve();

    let error: unknown;
    try {
      await promise;
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(authMock.restoreSession).toHaveBeenCalledWith(true);
    expect(authMock.startLogin).toHaveBeenCalledTimes(1);
  });

  it('should pass through internal errors untouched', async () => {
    const promise = get('/api/companies');
    await Promise.resolve();
    const req = httpMock.expectOne((candidate) => candidate.url.includes('/api/companies'));
    req.flush('boom', { status: 500, statusText: 'Internal Server Error' });

    let error: unknown;
    try {
      await promise;
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(authMock.restoreSession).not.toHaveBeenCalledWith(true);
    expect(authMock.logout).not.toHaveBeenCalled();
  });
});
