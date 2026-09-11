import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export const AUTH_WINDOW = new InjectionToken<Pick<Window, 'location'>>('Rumoo auth window', {
  factory: () => window,
});

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in?: number;
}

interface Pkce {
  verifier: string;
  challenge: string;
  state: string;
  nonce: string;
}

const REFRESH_BEFORE_EXPIRY_MS = 30_000;
const CALLBACK_PATH = '/callback';
const ACCESS_STORAGE_KEY = 'rumoo.auth.access';
const REFRESH_STORAGE_KEY = 'rumoo.auth.refresh';
const ID_STORAGE_KEY = 'rumoo.auth.id';
const EXPIRES_AT_STORAGE_KEY = 'rumoo.auth.expiresAt';
const VERIFIER_STORAGE_KEY = 'rumoo.oidc.verifier';
const STATE_STORAGE_KEY = 'rumoo.oidc.state';
const NONCE_STORAGE_KEY = 'rumoo.oidc.nonce';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly windowRef = inject(AUTH_WINDOW);
  private currentAccessToken: string | null = null;
  private currentRefreshToken: string | null = null;
  private currentIdToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  get isAuthenticated(): boolean {
    return this.currentAccessToken !== null;
  }

  get hasRefreshToken(): boolean {
    return this.currentRefreshToken !== null;
  }

  get accessToken(): string | null {
    return this.currentAccessToken;
  }

  get userRoles(): string[] {
    const claims = this.currentAccessToken ? decodeClaims(this.currentAccessToken) : {};
    const realmAccess = claims['realm_access'] as { roles?: string[] } | undefined;
    return realmAccess?.roles ?? [];
  }

  get tokenEndpointUrl(): string {
    return `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;
  }

  private get authorizeEndpointUrl(): string {
    return `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/auth`;
  }

  private get endSessionEndpointUrl(): string {
    return `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/logout`;
  }

  private get redirectUri(): string {
    return `${this.windowRef.location.origin}${CALLBACK_PATH}`;
  }

  async startLogin(): Promise<void> {
    const pkce = await this.generatePkce();
    sessionStorage.setItem(VERIFIER_STORAGE_KEY, pkce.verifier);
    sessionStorage.setItem(STATE_STORAGE_KEY, pkce.state);
    sessionStorage.setItem(NONCE_STORAGE_KEY, pkce.nonce);
    this.windowRef.location.assign(this.buildAuthorizeUrl(pkce));
  }

  async completeLogin(code: string, state: string): Promise<void> {
    const storedState = sessionStorage.getItem(STATE_STORAGE_KEY);
    const verifier = sessionStorage.getItem(VERIFIER_STORAGE_KEY);
    if (storedState === null || storedState !== state || verifier === null || code.length === 0) {
      throw new Error('Invalid OIDC state');
    }

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', environment.keycloak.clientId)
      .set('code', code)
      .set('redirect_uri', this.redirectUri)
      .set('code_verifier', verifier);

    const response = await lastValueFrom(
      this.http.post<TokenResponse>(this.tokenEndpointUrl, body)
    );
    sessionStorage.removeItem(STATE_STORAGE_KEY);
    sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
    sessionStorage.removeItem(NONCE_STORAGE_KEY);
    this.applyTokens(response);
  }

  async restoreSession(force = false): Promise<boolean> {
    if (this.currentAccessToken === null) {
      this.hydrateFromStorage();
    }
    if (this.currentAccessToken === null) {
      return false;
    }
    return this.refreshIfNeeded(force);
  }

  async refreshIfNeeded(force = false): Promise<boolean> {
    if (this.currentAccessToken === null) {
      return false;
    }

    if (this.currentRefreshToken === null) {
      return this.isAuthenticated;
    }

    if (
      !force &&
      this.tokenExpiry !== null &&
      this.tokenExpiry - Date.now() > REFRESH_BEFORE_EXPIRY_MS
    ) {
      return true;
    }

    if (this.refreshPromise !== null) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.refresh();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  logout(): void {
    const idToken = this.currentIdToken;
    this.clearSession();

    const params = new URLSearchParams({
      client_id: environment.keycloak.clientId,
      post_logout_redirect_uri: `${this.windowRef.location.origin}/login`,
    });
    if (idToken !== null) {
      params.set('id_token_hint', idToken);
    }
    this.windowRef.location.assign(`${this.endSessionEndpointUrl}?${params.toString()}`);
  }

  private async generatePkce(): Promise<Pkce> {
    const verifier = randomBase64Url(64);
    const challenge = await sha256Base64Url(verifier);
    return {
      verifier,
      challenge,
      state: randomBase64Url(16),
      nonce: randomBase64Url(16),
    };
  }

  private buildAuthorizeUrl(pkce: Pkce): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: environment.keycloak.clientId,
      redirect_uri: this.redirectUri,
      scope: 'openid profile email rumoo-scopes',
      state: pkce.state,
      nonce: pkce.nonce,
      code_challenge: pkce.challenge,
      code_challenge_method: 'S256',
    });
    return `${this.authorizeEndpointUrl}?${params.toString()}`;
  }

  private async refresh(): Promise<boolean> {
    if (this.currentRefreshToken === null) {
      this.clearSession();
      return false;
    }

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', environment.keycloak.clientId)
      .set('refresh_token', this.currentRefreshToken);

    try {
      const response = await lastValueFrom(
        this.http.post<TokenResponse>(this.tokenEndpointUrl, body)
      );
      this.applyTokens(response);
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  private hydrateFromStorage(): void {
    const access = sessionStorage.getItem(ACCESS_STORAGE_KEY);
    if (access === null) {
      return;
    }
    this.currentAccessToken = access;
    this.currentRefreshToken = sessionStorage.getItem(REFRESH_STORAGE_KEY);
    this.currentIdToken = sessionStorage.getItem(ID_STORAGE_KEY);
    const expiresAt = sessionStorage.getItem(EXPIRES_AT_STORAGE_KEY);
    this.tokenExpiry = expiresAt !== null ? Number(expiresAt) : null;
  }

  private applyTokens(response: TokenResponse): void {
    this.currentAccessToken = response.access_token;
    this.currentRefreshToken = response.refresh_token ?? this.currentRefreshToken;
    this.currentIdToken = response.id_token ?? this.currentIdToken;
    const claims = decodeClaims(response.access_token);
    this.tokenExpiry = typeof claims['exp'] === 'number' ? (claims['exp'] as number) * 1000 : null;
    this.persist();
  }

  private persist(): void {
    sessionStorage.setItem(ACCESS_STORAGE_KEY, this.currentAccessToken ?? '');
    sessionStorage.setItem(REFRESH_STORAGE_KEY, this.currentRefreshToken ?? '');
    sessionStorage.setItem(ID_STORAGE_KEY, this.currentIdToken ?? '');
    sessionStorage.setItem(EXPIRES_AT_STORAGE_KEY, String(this.tokenExpiry ?? ''));
  }

  private clearSession(): void {
    this.currentAccessToken = null;
    this.currentRefreshToken = null;
    this.currentIdToken = null;
    this.tokenExpiry = null;
    sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    sessionStorage.removeItem(ID_STORAGE_KEY);
    sessionStorage.removeItem(EXPIRES_AT_STORAGE_KEY);
  }
}

function randomBase64Url(size: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return binaryToBase64Url(binary);
}

function binaryToBase64Url(binary: string): string {
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Base64Url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  let binary = '';
  for (const byte of new Uint8Array(digest)) {
    binary += String.fromCharCode(byte);
  }
  return binaryToBase64Url(binary);
}

function decodeClaims(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return {};
  }
}
