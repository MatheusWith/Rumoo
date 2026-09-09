import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { KeycloakService } from 'keycloak-angular';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const keycloakMock = {
    isLoggedIn: jasmine.createSpy('isLoggedIn'),
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  };

  const testProviders = [{ provide: KeycloakService, useValue: keycloakMock }, provideRouter([])];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: testProviders,
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
    keycloakMock.isLoggedIn.and.returnValue(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent?.trim()).toBe('Sign out');
  });

  it('should show sign in when not authenticated', () => {
    keycloakMock.isLoggedIn.and.returnValue(false);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent?.trim()).toBe('Sign in');
  });

  it('should call keycloak login on sign in click', () => {
    keycloakMock.isLoggedIn.and.returnValue(false);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(keycloakMock.login).toHaveBeenCalled();
  });

  it('should call keycloak logout on sign out click', () => {
    keycloakMock.isLoggedIn.and.returnValue(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(keycloakMock.logout).toHaveBeenCalled();
  });
});
