import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, loginPageGuard } from './auth.guard';

class DummyComponent {}

function setup(authenticated: boolean, restored = false) {
  const authMock = {
    isAuthenticated: authenticated,
    restoreSession: jasmine.createSpy('restoreSession').and.returnValue(Promise.resolve(restored)),
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'login', component: DummyComponent, canActivate: [loginPageGuard] },
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
    const { router } = setup(false, true);
    expect(await router.navigate(['dashboard'])).toBe(true);
    expect(router.url).toBe('/dashboard');
  });

  it('should redirect to login when anonymous and the session cannot be restored', async () => {
    const { router } = setup(false, false);
    expect(await router.navigate(['dashboard'])).toBe(true);
    expect(router.url).toBe('/login');
  });
});

describe('loginPageGuard', () => {
  it('should allow the sign-in form for anonymous users', async () => {
    const { router } = setup(false);
    expect(await router.navigate(['login'])).toBe(true);
    expect(router.url).toBe('/login');
  });

  it('should redirect an authenticated user from the sign-in form to the dashboard', async () => {
    const { router } = setup(true);
    expect(await router.navigate(['login'])).toBe(true);
    expect(router.url).toBe('/dashboard');
  });
});

describe('home routes', () => {
  it('should end up at the dashboard when authenticated', async () => {
    const { router } = setup(true);
    expect(await router.navigate(['/'])).toBe(true);
    expect(router.url).toBe('/dashboard');
  });

  it('should end up at the sign-in form when anonymous', async () => {
    const { router } = setup(false);
    expect(await router.navigate(['/no-such-page'])).toBe(true);
    expect(router.url).toBe('/login');
  });
});
