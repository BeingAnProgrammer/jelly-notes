import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-settings-layout-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-layout.page.html',
  styleUrl: './settings-layout.page.scss',
})
export class SettingsLayoutPage {}
