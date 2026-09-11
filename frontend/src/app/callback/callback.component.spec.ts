import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '../core/auth/auth.service';
import { CallbackComponent } from './callback.component';

@Component({ selector: 'app-dummy', template: '', imports: [] })
class DummyComponent {}

describe('CallbackComponent', () => {
  let authMock: { completeLogin: jasmine.Spy };

  beforeEach(async () => {
    authMock = {
      completeLogin: jasmine.createSpy('completeLogin').and.returnValue(Promise.resolve()),
    };
    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
      providers: [
        provideRouter([
          { path: 'callback', component: CallbackComponent },
          { path: 'dashboard', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();
  });

  it('should exchange the authorization code and continue to the dashboard', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/callback?code=abc&state=xyz');
    await harness.fixture.whenStable();

    expect(authMock.completeLogin).toHaveBeenCalledWith('abc', 'xyz');
    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-dummy');
  });

  it('should show an error when the code exchange fails', async () => {
    authMock.completeLogin.and.returnValue(Promise.reject(new Error('invalid_grant')));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/callback?code=abc&state=xyz');
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('Sign-in failed');
  });

  it('should show an error when the callback is missing the authorization code', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/callback?state=xyz');
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('Sign-in failed');
    expect(authMock.completeLogin).not.toHaveBeenCalled();
  });

  it('should show an error when Keycloak reports an authorization error', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/callback?error=access_denied');
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.textContent).toContain('Sign-in failed');
    expect(authMock.completeLogin).not.toHaveBeenCalled();
  });
});
