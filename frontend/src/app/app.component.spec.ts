import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './core/auth/auth.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const authMock = {
    isAuthenticated: false,
    logout: jasmine.createSpy('logout'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: AuthService, useValue: authMock }, provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should show sign out when authenticated', () => {
    authMock.isAuthenticated = true;
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent?.trim()).toBe('Sign out');
  });

  it('should call logout on sign out click', () => {
    authMock.isAuthenticated = true;
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(authMock.logout).toHaveBeenCalled();
  });
});
