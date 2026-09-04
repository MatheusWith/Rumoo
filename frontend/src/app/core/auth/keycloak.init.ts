import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

export function provideKeycloakConfig(): EnvironmentProviders {
  if (!environment.keycloak.url) {
    console.warn('[Keycloak] KEYCLOAK_URL is not configured. Authentication is disabled.');
    return makeEnvironmentProviders([]);
  }

  return provideKeycloak({
    config: {
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    },
  });
}
