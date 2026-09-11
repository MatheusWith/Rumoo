import { TestBed } from '@angular/core/testing';
import { AuthService } from '../core/auth/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authMock: { startLogin: jasmine.Spy };

  function createComponent() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    authMock = {
      startLogin: jasmine.createSpy('startLogin').and.returnValue(Promise.resolve()),
    };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authMock }],
    });
  });

  it('should start the authorization flow when signing in', async () => {
    const fixture = createComponent();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(authMock.startLogin).toHaveBeenCalledTimes(1);
  });

  it('should ignore double clicks while the redirect is in flight', () => {
    authMock.startLogin.and.returnValue(new Promise(() => undefined));
    const fixture = createComponent();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    button.click();
    expect(authMock.startLogin).toHaveBeenCalledTimes(1);
  });
});
