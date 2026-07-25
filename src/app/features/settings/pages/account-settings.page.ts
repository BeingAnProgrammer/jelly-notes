import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/seo/seo.service';
import { AvatarComponent, AVATAR_GRADIENTS } from '../../../shared/ui/avatar/avatar.component';
import { AvatarGradient } from '../../../core/auth/models/user.model';
import { initialsOf } from '../../../shared/utils/initials';

@Component({
  selector: 'app-account-settings-page',
  imports: [ReactiveFormsModule, AvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-settings.page.html',
  styleUrl: './account-settings.page.scss',
})
export class AccountSettingsPage {
  protected readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly avatarOptions = Object.keys(AVATAR_GRADIENTS) as AvatarGradient[];
  protected readonly nameControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  protected readonly initialsOf = initialsOf;

  constructor() {
    inject(SeoService).update('Account', 'Manage your Memora profile.');

    effect(() => {
      const user = this.auth.currentUser();
      if (user) this.nameControl.setValue(user.displayName, { emitEvent: false });
    });
  }

  selectAvatar(gradient: AvatarGradient): void {
    this.auth.updateProfile({ avatar: gradient });
    this.toast.show('Photo updated');
  }

  saveName(): void {
    if (this.nameControl.invalid) return;
    this.auth.updateProfile({ displayName: this.nameControl.value });
    this.toast.show('Account updated');
  }

  protected avatarGradientCss(gradient: AvatarGradient): string {
    return AVATAR_GRADIENTS[gradient];
  }
}
