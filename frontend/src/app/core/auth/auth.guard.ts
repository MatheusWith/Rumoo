import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean> => {
  // TODO: implement actual role-based logic when features arrive
  return authData.authenticated;
};

export const authGuard = createAuthGuard(isAccessAllowed);
