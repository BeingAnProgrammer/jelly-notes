import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import type { IconName } from '../../../../shared/ui/icon/icon.types';

export interface FeatureBlock {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

// A heading plus a row of small value-prop blocks — shared shape for the "why this feature
// matters" section on every feature landing page. Grid auto-fits so 3 or 4 items both read well.
@Component({
  selector: 'app-feature-section',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-section.component.html',
  styleUrl: './feature-section.component.scss',
})
export class FeatureSectionComponent {
  readonly heading = input.required<string>();
  readonly items = input.required<readonly FeatureBlock[]>();
}
