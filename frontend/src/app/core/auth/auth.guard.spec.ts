import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

class DummyComponent {}

function setup(authenticated: boolean, restored = false) {
  const authMock = {
    isAuthenticated: authenticated,
    restoreSession: jasmine.createSpy('restoreSession').and.returnValue(Promise.resolve(restored)),
    startLogin: jasmine.createSpy('startLogin').and.returnValue(Promise.resolve()),
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'dashboard', component: DummyComponent, canActivate: [authGuard] },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: '**', redirectTo: 'dashboard' },
      ]),
      { provide: AuthService, useValue: authMock },
    ],
  });
  return { router: TestBed.inject(Router), authMock };
}

describe('authGuard', () => {
  it('should allow navigation when authenticated without restoring', async () => {
    const { router, authMock } = setup(true);
    expect(await router.navigate(['dashboard'])).toBe(true);
    expect(authMock.restoreSession).not.toHaveBeenCalled();
  });

  it('should restore the session and allow navigation when it succeeds', async () => {
    const { router, authMock } = setup(false, true);
    expect(await router.navigate(['dashboard'])).toBe(true);
    expect(router.url).toBe('/dashboard');
    expect(authMock.startLogin).not.toHaveBeenCalled();
  });

  it('should start login in Keycloak when anonymous and the session cannot be restored', async () => {
    const { router, authMock } = setup(false, false);
    expect(await router.navigate(['dashboard'])).toBe(false);
    expect(authMock.startLogin).toHaveBeenCalledTimes(1);
    expect(authMock.restoreSession).toHaveBeenCalledTimes(1);
  });
});

describe('home routes', () => {
  it('should end up at the dashboard when authenticated', async () => {
    const { router } = setup(true);
    expect(await router.navigate(['/'])).toBe(true);
    expect(router.url).toBe('/dashboard');
  });

  it('should start login in Keycloak when anonymous', async () => {
    const { router, authMock } = setup(false);
    await router.navigate(['/no-such-page']);
    expect(authMock.startLogin).toHaveBeenCalledTimes(1);
  });
});
