import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppearanceService } from './core/appearance/services/appearance.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Applies the saved theme to <html data-theme> on every route, not just ones that happen to
  // render a component that injects AppearanceService (previously only CommandPaletteComponent,
  // inside the authenticated app shell — logged-out pages like /welcome never applied a saved
  // light-theme preference).
  private readonly appearance = inject(AppearanceService);
}
