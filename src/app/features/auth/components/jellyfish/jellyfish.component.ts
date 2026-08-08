import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { JellyfishSceneComponent } from '../jellyfish-scene/jellyfish-scene.component';

// The reusable jellyfish visual: the procedural WebGL scene plus the backlight glow it always
// renders with. Fills whatever box its host page gives it (100% width/height) — sizing and
// placement are the consuming page's job, not this component's.
@Component({
  selector: 'app-jellyfish',
  imports: [JellyfishSceneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './jellyfish.component.html',
  styleUrl: './jellyfish.component.scss',
})
export class JellyfishComponent {
  readonly loopSeconds = input(20);
}
