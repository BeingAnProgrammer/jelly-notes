import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppearanceService, Theme } from '../../../core/appearance/services/appearance.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/seo/seo.service';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-appearance-settings-page',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './appearance-settings.page.html',
  styleUrl: './appearance-settings.page.scss',
})
export class AppearanceSettingsPage {
  protected readonly appearance = inject(AppearanceService);
  private readonly toast = inject(ToastService);

  constructor() {
    inject(SeoService).update('Appearance', 'Choose how Jelly Notes looks.');
  }

  setTheme(theme: Theme): void {
    this.appearance.setTheme(theme);
    this.toast.show(`${theme === 'dark' ? 'Dark' : 'Light'} theme on`);
  }
}
