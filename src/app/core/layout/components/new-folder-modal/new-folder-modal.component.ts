import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { FoldersService } from '../../../folders/services/folders.service';

const FOLDER_SWATCHES = ['var(--accent)', 'var(--ochre)', 'var(--ink-blue)', 'var(--rust)', '#5b8def', '#c06bd9'];

interface NewFolderForm {
  name: FormControl<string>;
  color: FormControl<string>;
}

@Component({
  selector: 'app-new-folder-modal',
  imports: [ModalComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal ariaLabel="Create a new folder" (dismissed)="closed.emit()">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <h2 class="heading">New folder</h2>

        <label class="field-label" for="folder-name">Folder name</label>
        <input id="folder-name" class="text-input" type="text" formControlName="name" autocomplete="off" />

        <span class="field-label">Color</span>
        <div class="swatches" role="radiogroup" aria-label="Folder color">
          @for (swatch of swatches; track swatch) {
            <button
              type="button"
              class="swatch"
              role="radio"
              [attr.aria-checked]="form.controls.color.value === swatch"
              [attr.aria-label]="'Color swatch'"
              [style.background]="swatch"
              [class.selected]="form.controls.color.value === swatch"
              (click)="form.controls.color.setValue(swatch)"
            ></button>
          }
        </div>

        <div class="footer">
          <button type="button" class="btn-ghost" (click)="closed.emit()">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="form.invalid">Create folder</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: `
    @use 'mixins' as *;

    form {
      display: flex;
      flex-direction: column;
      padding: var(--space-24);
      gap: var(--space-8);
    }

    .heading {
      margin: 0 0 var(--space-12);
      font-family: var(--font-display);
      font-size: var(--text-22);
      font-weight: 400;
      color: var(--ink);
    }

    .field-label {
      font-size: var(--text-12);
      font-weight: var(--weight-semibold);
      color: var(--ink-3);
    }

    .text-input {
      width: 100%;
      padding: var(--space-9) var(--space-12);
      margin-bottom: var(--space-8);
      border: 1px solid var(--hairline);
      border-radius: var(--radius-md);
      background: var(--canvas-sub);
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: var(--text-14);

      &:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 1px;
      }
    }

    .swatches {
      display: flex;
      gap: var(--space-10);
      margin: var(--space-6) 0 var(--space-8);
    }

    .swatch {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-full);
      border: none;
      cursor: pointer;
      transition: transform var(--duration-fast) var(--ease-standard);

      &:hover {
        transform: scale(1.1);
      }

      &.selected {
        box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--ink);
      }

      @include focus-ring;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-8);
      margin-top: var(--space-12);
    }

    .btn-ghost {
      @include ghost-button;
      padding: var(--space-8) var(--space-14);
    }

    .btn-primary {
      @include primary-button;
      padding: var(--space-8) var(--space-14);

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `,
})
export class NewFolderModalComponent {
  private readonly foldersService = inject(FoldersService);

  protected readonly swatches = FOLDER_SWATCHES;
  protected readonly form = new FormGroup<NewFolderForm>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl(FOLDER_SWATCHES[0], { nonNullable: true }),
  });

  readonly closed = output<void>();

  submit(): void {
    if (this.form.invalid) return;
    const { name, color } = this.form.getRawValue();
    this.foldersService.create(name, color);
    this.closed.emit();
  }
}
