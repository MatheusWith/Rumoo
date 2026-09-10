import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authMock: { login: jasmine.Spy; isAuthenticated: boolean };

  function createComponent() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    authMock = {
      isAuthenticated: false,
      login: jasmine.createSpy('login'),
    };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authMock }],
    });
  });

  it('should sign in with the entered credentials and go to the dashboard', async () => {
    authMock.login.and.returnValue(Promise.resolve());
    const fixture = createComponent();
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const native = fixture.nativeElement as HTMLElement;
    (native.querySelector('input[name="username"]') as HTMLInputElement).value = 'jane';
    (native.querySelector('input[name="password"]') as HTMLInputElement).value = 'secret';
    native.querySelector('input[name="username"]')!.dispatchEvent(new Event('input'));
    native.querySelector('input[name="password"]')!.dispatchEvent(new Event('input'));
    (native.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    await fixture.whenStable();
    expect(authMock.login).toHaveBeenCalledWith('jane', 'secret');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show the error message when the credentials are rejected', async () => {
    authMock.login.and.returnValue(Promise.reject(new Error('invalid_grant')));
    const fixture = createComponent();
    const native = fixture.nativeElement as HTMLElement;

    (native.querySelector('input[name="username"]') as HTMLInputElement).value = 'jane';
    native.querySelector('input[name="username"]')!.dispatchEvent(new Event('input'));
    (native.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Invalid credentials');
  });

  it('should disable the button while the request is in flight', () => {
    authMock.login.and.returnValue(new Promise(() => undefined));
    const fixture = createComponent();
    const native = fixture.nativeElement as HTMLElement;

    (native.querySelector('input[name="username"]') as HTMLInputElement).value = 'jane';
    native.querySelector('input[name="username"]')!.dispatchEvent(new Event('input'));
    (native.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect((native.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(
      true
    );
  });
});
