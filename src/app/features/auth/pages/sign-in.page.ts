import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { SeoService } from '../../../core/seo/seo.service';

@Component({
  selector: 'app-sign-in-page',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    inject(SeoService).update(
      'Welcome',
      'Memora is an AI-powered note-taking and personal knowledge management app.',
    );
  }

  signIn(): void {
    this.auth.signIn();
    this.router.navigate(['/dashboard']);
  }
}
