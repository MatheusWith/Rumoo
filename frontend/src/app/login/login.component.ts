import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  readonly signingIn = signal(false);

  async onSignIn(): Promise<void> {
    if (this.signingIn()) {
      return;
    }
    this.signingIn.set(true);
    try {
      await this.auth.startLogin();
    } finally {
      this.signingIn.set(false);
    }
  }
}
