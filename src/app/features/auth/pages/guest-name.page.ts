import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-guest-name-page',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guest-name.page.html',
  styleUrl: './guest-name.page.scss',
})
export class GuestNamePage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    inject(SeoService).update('Continue as guest', 'Tell us what to call you.');
  }

  onSubmit(event: Event, nameInput: HTMLInputElement): void {
    event.preventDefault();
    this.auth.signInAsGuest(nameInput.value);
    this.router.navigate(['/app/dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/sign-in']);
  }
}
