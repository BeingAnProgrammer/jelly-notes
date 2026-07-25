import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-sign-in-form-page',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in-form.page.html',
  styleUrl: './sign-in-form.page.scss',
})
export class SignInFormPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly showForgotHint = signal(false);

  constructor() {
    inject(SeoService).update('Sign in', 'Sign in to Jelly Notes.');
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((shown) => !shown);
  }

  toggleForgotHint(): void {
    this.showForgotHint.update((shown) => !shown);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.continueToDashboard();
  }

  continueToDashboard(): void {
    this.auth.signIn();
    this.router.navigate(['/dashboard']);
  }
}
