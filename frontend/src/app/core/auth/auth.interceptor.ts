import {
  createInterceptorCondition,
  includeBearerTokenInterceptor,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(https?:\/\/)(www\.)?[^/]+(\/api\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

export const authInterceptors = [includeBearerTokenInterceptor];
export const authInterceptorConfig = [apiCondition];
