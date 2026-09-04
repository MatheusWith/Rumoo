import {
  createInterceptorCondition,
  includeBearerTokenInterceptor,
  IncludeBearerTokenCondition,
} from 'keycloak-angular';

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:8080)(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

export const authInterceptors = [includeBearerTokenInterceptor];
export const authInterceptorConfig = [apiCondition];
