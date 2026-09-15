import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideAlertTriangle,
  lucideBell,
  lucideCheckCircle2,
  lucideChevronDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideInbox,
  lucideInfo,
  lucideLoader2,
  lucideMoreVertical,
  lucideSearch,
  lucideSettings,
  lucideStar,
  lucideUser,
  lucideX,
} from '@ng-icons/lucide';
import { authInterceptor } from './core/auth/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideIcons({
      lucideAlertCircle,
      lucideAlertTriangle,
      lucideBell,
      lucideCheckCircle2,
      lucideChevronDown,
      lucideChevronLeft,
      lucideChevronRight,
      lucideInbox,
      lucideInfo,
      lucideLoader2,
      lucideMoreVertical,
      lucideSearch,
      lucideSettings,
      lucideStar,
      lucideUser,
      lucideX,
    }),
  ],
};
