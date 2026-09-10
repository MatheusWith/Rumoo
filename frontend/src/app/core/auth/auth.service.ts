import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

const REFRESH_BEFORE_EXPIRY_MS = 30_000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private currentAccessToken: string | null = null;
  private currentRefreshToken: string | null = null;
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

  async login(username: string, password: string): Promise<void> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', environment.keycloak.clientId)
      .set('username', username)
      .set('password', password);

    const response = await lastValueFrom(
      this.http.post<TokenResponse>(this.tokenEndpointUrl, body)
    );
    this.applyTokens(response);
  }

  async refreshIfNeeded(force = false): Promise<boolean> {
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

  private async refresh(): Promise<boolean> {
    if (this.currentRefreshToken === null) {
      this.logout();
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
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.currentAccessToken = null;
    this.currentRefreshToken = null;
    this.tokenExpiry = null;
  }

  private applyTokens(response: TokenResponse): void {
    this.currentAccessToken = response.access_token;
    this.currentRefreshToken = response.refresh_token;
    const claims = decodeClaims(response.access_token);
    this.tokenExpiry = typeof claims['exp'] === 'number' ? (claims['exp'] as number) * 1000 : null;
  }
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
