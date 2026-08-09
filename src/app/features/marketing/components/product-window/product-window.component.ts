import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ProductWindowTheme = 'notes' | 'search' | 'assignments';

// The "app window" chrome (title bar, traffic-light dots, layered pastel backdrop) shared by
// every feature page's product visual — each page projects its own bespoke inner content, so
// the three pages tell different visual stories while still looking like the same product.
@Component({
  selector: 'app-product-window',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-window.component.html',
  styleUrl: './product-window.component.scss',
})
export class ProductWindowComponent {
  readonly title = input('Jelly Notes');
  // Solid face color, same palette as the welcome-page showcase — omit for a plain white window.
  readonly theme = input<ProductWindowTheme | undefined>(undefined);
}
