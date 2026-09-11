import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AUTH_WINDOW, AuthService } from './auth.service';

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
const AUTH_ENDPOINT = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/auth`;
const LOGOUT_ENDPOINT = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/logout`;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let locationAssign: jasmine.Spy;

  beforeEach(() => {
    sessionStorage.clear();
    locationAssign = jasmine.createSpy('location.assign');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AUTH_WINDOW,
          useValue: {
            location: { assign: locationAssign, origin: 'http://localhost:8080' },
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should start signed out', () => {
    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();
    expect(service.userRoles).toEqual([]);
  });

  describe('startLogin', () => {
    it('should persist a PKCE verifier, challenge, state and nonce and redirect to the authorize endpoint', async () => {
      await service.startLogin();

      const verifier = sessionStorage.getItem('rumoo.oidc.verifier');
      const state = sessionStorage.getItem('rumoo.oidc.state');
      const nonce = sessionStorage.getItem('rumoo.oidc.nonce');
      expect(verifier).not.toBeNull();
      expect(state).not.toBeNull();
      expect(nonce).not.toBeNull();

      expect(locationAssign).toHaveBeenCalledTimes(1);
      const url = locationAssign.calls.mostRecent().args[0] as string;
      expect(url.startsWith(AUTH_ENDPOINT)).toBe(true);

      const query = new URLSearchParams(url.split('?')[1]);
      expect(query.get('response_type')).toBe('code');
      expect(query.get('client_id')).toBe(environment.keycloak.clientId);
      expect(query.get('redirect_uri')).toBe('http://localhost:8080/callback');
      expect(query.get('code_challenge_method')).toBe('S256');
      expect(query.get('state')).toBe(state);
      expect(query.get('nonce')).toBe(nonce);
      expect(query.get('scope')).toContain('openid');
    });

    it('should make its code challenge a valid S256 hash of the verifier', async () => {
      await service.startLogin();

      const verifier = sessionStorage.getItem('rumoo.oidc.verifier')!;
      const url = locationAssign.calls.mostRecent().args[0] as string;
      const challenge = new URLSearchParams(url.split('?')[1]).get('code_challenge')!;

      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
      const expected = base64Url(String.fromCharCode(...new Uint8Array(digest)));
      expect(challenge).toBe(expected);
    });
  });

  describe('completeLogin', () => {
    it('should exchange the authorization code with the PKCE verifier and establish the session', async () => {
      sessionStorage.setItem('rumoo.oidc.verifier', 'the-verifier');
      sessionStorage.setItem('rumoo.oidc.state', 'the-state');
      sessionStorage.setItem('rumoo.oidc.nonce', 'the-nonce');

      const token = tokenWith(['company:read', 'company:create']);
      const loginPromise = service.completeLogin('the-code', 'the-state');

      const req = httpMock.expectOne(TOKEN_ENDPOINT);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.get('grant_type')).toBe('authorization_code');
      expect(req.request.body.get('client_id')).toBe(environment.keycloak.clientId);
      expect(req.request.body.get('code')).toBe('the-code');
      expect(req.request.body.get('redirect_uri')).toBe('http://localhost:8080/callback');
      expect(req.request.body.get('code_verifier')).toBe('the-verifier');
      req.flush({
        access_token: token,
        refresh_token: 'r1',
        id_token: 'id-1',
        expires_in: 300,
      });

      await loginPromise;
      expect(service.isAuthenticated).toBe(true);
      expect(service.accessToken).toBe(token);
      expect(sessionStorage.getItem('rumoo.oidc.verifier')).toBeNull();
      expect(sessionStorage.getItem('rumoo.oidc.state')).toBeNull();
    });

    it('should reject when the returned state does not match the stored state', async () => {
      sessionStorage.setItem('rumoo.oidc.verifier', 'the-verifier');
      sessionStorage.setItem('rumoo.oidc.state', 'expected-state');
      sessionStorage.setItem('rumoo.oidc.nonce', 'the-nonce');

      let error: unknown;
      try {
        await service.completeLogin('the-code', 'tampered-state');
      } catch (e) {
        error = e;
      }

      expect(error).toBeTruthy();
      expect(service.isAuthenticated).toBe(false);
      httpMock.expectNone(TOKEN_ENDPOINT);
    });

    it('should reject when no state or verifier was stored for this login', async () => {
      let error: unknown;
      try {
        await service.completeLogin('the-code', 'stray-state');
      } catch (e) {
        error = e;
      }

      expect(error).toBeTruthy();
      expect(service.isAuthenticated).toBe(false);
      httpMock.expectNone(TOKEN_ENDPOINT);
    });

    it('should persist the session to sessionStorage', async () => {
      sessionStorage.setItem('rumoo.oidc.verifier', 'the-verifier');
      sessionStorage.setItem('rumoo.oidc.state', 'the-state');
      sessionStorage.setItem('rumoo.oidc.nonce', 'the-nonce');

      const loginPromise = service.completeLogin('the-code', 'the-state');
      httpMock.expectOne(TOKEN_ENDPOINT).flush({
        access_token: tokenWith(['company:read']),
        refresh_token: 'r1',
        id_token: 'id-1',
      });
      await loginPromise;

      expect(sessionStorage.getItem('rumoo.auth.access')).toBe(service.accessToken);
      expect(sessionStorage.getItem('rumoo.auth.refresh')).toBe('r1');
      expect(sessionStorage.getItem('rumoo.auth.id')).toBe('id-1');
      expect(sessionStorage.getItem('rumoo.auth.expiresAt')).not.toBeNull();
    });

    it('should expose the expanded roles from the access token', async () => {
      sessionStorage.setItem('rumoo.oidc.verifier', 'v');
      sessionStorage.setItem('rumoo.oidc.state', 's');
      sessionStorage.setItem('rumoo.oidc.nonce', 'n');

      const loginPromise = service.completeLogin('c', 's');
      httpMock.expectOne(TOKEN_ENDPOINT).flush({
        access_token: tokenWith(['company:read', 'company:create']),
        refresh_token: 'r1',
      });
      await loginPromise;
      expect(service.userRoles).toEqual(['company:read', 'company:create']);
    });
  });

  describe('restoreSession', () => {
    it('should hydrate the session from storage after a reload', async () => {
      const token = tokenWith(['company:read'], Math.floor(Date.now() / 1000) + 600);
      sessionStorage.setItem('rumoo.auth.access', token);
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem('rumoo.auth.id', 'id-1');
      sessionStorage.setItem(
        'rumoo.auth.expiresAt',
        String(Math.floor(Date.now() / 1000 + 600) * 1000)
      );

      expect(await service.restoreSession()).toBe(true);
      expect(service.isAuthenticated).toBe(true);
      expect(service.accessToken).toBe(token);
      httpMock.expectNone(TOKEN_ENDPOINT);
    });

    it('should refresh when the restored access token is near expiry', async () => {
      const soon = Math.floor(Date.now() / 1000) + 5;
      sessionStorage.setItem('rumoo.auth.access', tokenWith(['company:read'], soon));
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem('rumoo.auth.expiresAt', String(soon * 1000));

      const fresh = tokenWith(['company:read'], Math.floor(Date.now() / 1000) + 300);
      const restorePromise = service.restoreSession();
      const req = httpMock.expectOne(TOKEN_ENDPOINT);
      expect(req.request.body.get('grant_type')).toBe('refresh_token');
      req.flush({ access_token: fresh, refresh_token: 'r2', id_token: 'id-2' });

      expect(await restorePromise).toBe(true);
      expect(service.accessToken).toBe(fresh);
    });

    it('should return false when nothing is stored', async () => {
      expect(await service.restoreSession()).toBe(false);
      expect(service.isAuthenticated).toBe(false);
      httpMock.expectNone(TOKEN_ENDPOINT);
    });
  });

  describe('refreshIfNeeded', () => {
    it('should rotate the refresh token on refresh', async () => {
      const far = Math.floor(Date.now() / 1000) + 600;
      const token = tokenWith(['company:read'], far);
      sessionStorage.setItem('rumoo.auth.access', token);
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem('rumoo.auth.expiresAt', String(far * 1000));

      expect(await service.restoreSession()).toBe(true);

      const fresh = tokenWith(['company:read'], far);
      const refreshPromise = service.refreshIfNeeded(true);
      const req = httpMock.expectOne(TOKEN_ENDPOINT);
      expect(req.request.body.get('grant_type')).toBe('refresh_token');
      req.flush({ access_token: fresh, refresh_token: 'r2', id_token: 'id-2' });

      await refreshPromise;
      expect(service.accessToken).toBe(fresh);
      expect(sessionStorage.getItem('rumoo.auth.refresh')).toBe('r2');
    });

    it('should not refresh when the access token is still valid for a while', async () => {
      const far = Math.floor(Date.now() / 1000) + 600;
      sessionStorage.setItem('rumoo.auth.access', tokenWith([], far));
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem('rumoo.auth.expiresAt', String(far * 1000));

      expect(await service.restoreSession()).toBe(true);
      expect(await service.refreshIfNeeded()).toBe(true);
      httpMock.expectNone(TOKEN_ENDPOINT);
    });

    it('should end the session when the refresh token is rejected', async () => {
      const far = Math.floor(Date.now() / 1000) + 600;
      sessionStorage.setItem('rumoo.auth.access', tokenWith([], far));
      sessionStorage.setItem('rumoo.auth.refresh', 'dead');
      sessionStorage.setItem('rumoo.auth.expiresAt', String(far * 1000));

      expect(await service.restoreSession()).toBe(true);
      const refreshPromise = service.refreshIfNeeded(true);
      httpMock
        .expectOne(TOKEN_ENDPOINT)
        .flush({ error: 'invalid_grant' }, { status: 400, statusText: 'Bad Request' });

      expect(await refreshPromise).toBe(false);
      expect(service.isAuthenticated).toBe(false);
      expect(sessionStorage.getItem('rumoo.auth.access')).toBeNull();
    });

    it('should deduplicate concurrent refresh calls into a single request', async () => {
      const far = Math.floor(Date.now() / 1000) + 600;
      sessionStorage.setItem('rumoo.auth.access', tokenWith([], far));
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem('rumoo.auth.expiresAt', String(far * 1000));

      expect(await service.restoreSession()).toBe(true);

      const fresh = tokenWith([], far);
      const first = service.refreshIfNeeded(true);
      const second = service.refreshIfNeeded(true);
      httpMock
        .expectOne(TOKEN_ENDPOINT)
        .flush({ access_token: fresh, refresh_token: 'r2', id_token: 'id-2' });

      await first;
      await second;
      expect(service.accessToken).toBe(fresh);
      httpMock.verify();
    });
  });

  describe('logout', () => {
    async function signIn(): Promise<void> {
      sessionStorage.setItem('rumoo.oidc.verifier', 'v');
      sessionStorage.setItem('rumoo.oidc.state', 's');
      sessionStorage.setItem('rumoo.oidc.nonce', 'n');
      const loginPromise = service.completeLogin('c', 's');
      httpMock.expectOne(TOKEN_ENDPOINT).flush({
        access_token: tokenWith(['company:read']),
        refresh_token: 'r1',
        id_token: 'id-1',
      });
      await loginPromise;
    }

    it('should clear the session and redirect to the Keycloak end-session endpoint', async () => {
      await signIn();

      service.logout();

      expect(service.isAuthenticated).toBe(false);
      expect(sessionStorage.getItem('rumoo.auth.access')).toBeNull();
      expect(sessionStorage.getItem('rumoo.auth.refresh')).toBeNull();

      expect(locationAssign).toHaveBeenCalledTimes(1);
      const url = locationAssign.calls.mostRecent().args[0] as string;
      expect(url.startsWith(LOGOUT_ENDPOINT)).toBe(true);
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain('client_id=rumoo-frontend');
      expect(decoded).toContain('id_token_hint=id-1');
      expect(decoded).toContain('post_logout_redirect_uri=http://localhost:8080/');
    });

    it('should still redirect to the end-session endpoint when no id_token is available', async () => {
      const token = tokenWith(['company:read'], Math.floor(Date.now() / 1000) + 600);
      sessionStorage.setItem('rumoo.auth.access', token);
      sessionStorage.setItem('rumoo.auth.refresh', 'r1');
      sessionStorage.setItem(
        'rumoo.auth.expiresAt',
        String((Math.floor(Date.now() / 1000) + 600) * 1000)
      );

      expect(await service.restoreSession()).toBe(true);
      service.logout();

      const url = locationAssign.calls.mostRecent().args[0] as string;
      expect(url.startsWith(LOGOUT_ENDPOINT)).toBe(true);
      expect(decodeURIComponent(url)).toContain('client_id=rumoo-frontend');
    });
  });
});
