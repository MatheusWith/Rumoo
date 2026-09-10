import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

function base64Url(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(claims: object): string {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify(claims));
  return `${header}.${payload}.signature`;
}

function tokenWith(roles: string[], exp = Math.floor(Date.now() / 1000) + 300): string {
  return makeToken({
    iss: 'http://localhost:8080/auth/realms/Rumoo',
    sub: 'user',
    exp,
    realm_access: { roles },
  });
}

const TOKEN_ENDPOINT = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let errorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    errorSpy = spyOn(console, 'error');
  });

  afterEach(() => httpMock.verify());

  it('should start signed out', () => {
    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();
    expect(service.userRoles).toEqual([]);
  });

  it('should sign in with valid credentials', async () => {
    const token = tokenWith(['company:read', 'company:create']);
    const loginPromise = service.login('jane', 'secret');

    const req = httpMock.expectOne(TOKEN_ENDPOINT);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('grant_type')).toBe('password');
    expect(req.request.body.get('client_id')).toBe(environment.keycloak.clientId);
    expect(req.request.body.get('username')).toBe('jane');
    expect(req.request.body.get('password')).toBe('secret');
    req.flush({ access_token: token, refresh_token: 'r', expires_in: 300 });

    await loginPromise;
    expect(service.isAuthenticated).toBe(true);
    expect(service.accessToken).toBe(token);
  });

  it('should expose the expanded roles from the access token', async () => {
    const token = tokenWith(['company:read', 'company:create']);
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: token, refresh_token: 'r', expires_in: 300 });

    await loginPromise;
    expect(service.userRoles).toEqual(['company:read', 'company:create']);
  });

  it('should expose no roles when the token has no realm access claim', async () => {
    const token = makeToken({
      iss: 'http://localhost:8080/auth/realms/Rumoo',
      sub: 'user',
      exp: 9999999999,
    });
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: token, refresh_token: 'r', expires_in: 300 });

    await loginPromise;
    expect(service.userRoles).toEqual([]);
  });

  it('should reject invalid credentials', async () => {
    let error: unknown;
    const loginPromise = service.login('jane', 'wrong');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ error: 'invalid_grant' }, { status: 400, statusText: 'Bad Request' });

    try {
      await loginPromise;
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
    expect(service.isAuthenticated).toBe(false);
  });

  it('should clear the session on logout', async () => {
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: tokenWith(['company:read']), refresh_token: 'r', expires_in: 300 });
    await loginPromise;

    service.logout();

    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();
    expect(service.userRoles).toEqual([]);
  });

  it('should not log the password to the console', async () => {
    const loginPromise = service.login('jane', 'hunter2');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ error: 'invalid_grant' }, { status: 400, statusText: 'Bad Request' });
    try {
      await loginPromise;
    } catch {
      // expected
    }
    errorSpy.calls.allArgs().forEach((args) => expect(args.join(' ')).not.toContain('hunter2'));
    expect(errorSpy).not.toHaveBeenCalledWith(jasmine.stringMatching('hunter2'));
  });

  it('should refresh before the access token expires', async () => {
    const soon = Math.floor(Date.now() / 1000) + 10;
    const loginPromise = service.login('jane', 'secret');
    httpMock.expectOne(TOKEN_ENDPOINT).flush({
      access_token: tokenWith(['company:read'], soon),
      refresh_token: 'r1',
      expires_in: 300,
    });
    await loginPromise;

    const fresh = tokenWith(['company:read'], Math.floor(Date.now() / 1000) + 300);
    const refreshPromise = service.refreshIfNeeded();
    const req = httpMock.expectOne(TOKEN_ENDPOINT);
    expect(req.request.body.get('grant_type')).toBe('refresh_token');
    expect(req.request.body.get('client_id')).toBe(environment.keycloak.clientId);
    req.flush({ access_token: fresh, refresh_token: 'r2', expires_in: 300 });

    await refreshPromise;
    expect(service.accessToken).toBe(fresh);
  });

  it('should not refresh when the access token is still valid for a while', async () => {
    const far = Math.floor(Date.now() / 1000) + 600;
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: tokenWith([], far), refresh_token: 'r1', expires_in: 600 });
    await loginPromise;

    await service.refreshIfNeeded();
    httpMock.expectNone(TOKEN_ENDPOINT);
    expect(service.isAuthenticated).toBe(true);
  });

  it('should end the session when the refresh token is rejected', async () => {
    const expired = Math.floor(Date.now() / 1000) - 10;
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: tokenWith([], expired), refresh_token: 'dead', expires_in: 300 });
    await loginPromise;

    const refreshPromise = service.refreshIfNeeded();
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ error: 'invalid_grant' }, { status: 400, statusText: 'Bad Request' });

    await refreshPromise;
    expect(service.isAuthenticated).toBe(false);
  });

  it('should deduplicate concurrent refresh calls into a single request', async () => {
    const soon = Math.floor(Date.now() / 1000) + 10;
    const loginPromise = service.login('jane', 'secret');
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: tokenWith([], soon), refresh_token: 'r1', expires_in: 300 });
    await loginPromise;

    const fresh = tokenWith([], Math.floor(Date.now() / 1000) + 300);
    const first = service.refreshIfNeeded();
    const second = service.refreshIfNeeded();
    httpMock
      .expectOne(TOKEN_ENDPOINT)
      .flush({ access_token: fresh, refresh_token: 'r2', expires_in: 300 });

    await first;
    await second;
    expect(service.accessToken).toBe(fresh);
    httpMock.verify();
  });
});
