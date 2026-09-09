import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly keycloakService = inject(KeycloakService);

  get isAuthenticated(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  login(): void {
    void this.keycloakService.login();
  }

  logout(): void {
    void this.keycloakService.logout(window.location.origin);
  }
}
