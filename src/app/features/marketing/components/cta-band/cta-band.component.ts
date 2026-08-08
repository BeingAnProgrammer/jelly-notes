import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

// The closing CTA every feature landing page ends on — same primary-button treatment as the
// hero's, just on its own line so the page has a clear final action.
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cta-band.component.html',
  styleUrl: './cta-band.component.scss',
})
export class CtaBandComponent {
  readonly headline = input.required<string>();
  readonly ctaLabel = input.required<string>();
  readonly ctaLink = input('/sign-in');
}
