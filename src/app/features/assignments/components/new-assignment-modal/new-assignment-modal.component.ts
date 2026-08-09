import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { AssignmentsService } from '../../services/assignments.service';

const DAY_MS = 24 * 60 * 60 * 1000;

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface NewAssignmentForm {
  title: FormControl<string>;
  due: FormControl<string>;
}

@Component({
  selector: 'app-new-assignment-modal',
  imports: [ModalComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal ariaLabel="Create a new assignment" (dismissed)="closed.emit()">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <h2 class="heading">New assignment</h2>

        <label class="field-label" for="assignment-title">Title</label>
        <input
          id="assignment-title"
          class="text-input"
          type="text"
          formControlName="title"
          autocomplete="off"
          autofocus
        />

        <label class="field-label" for="assignment-due">Due date</label>
        <input id="assignment-due" class="text-input" type="date" formControlName="due" />

        <div class="footer">
          <button type="button" class="btn-ghost" (click)="closed.emit()">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="form.invalid">
            Create assignment
          </button>
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
export class NewAssignmentModalComponent {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup<NewAssignmentForm>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    due: new FormControl(toDateInputValue(new Date(Date.now() + 7 * DAY_MS)), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly closed = output<void>();

  submit(): void {
    if (this.form.invalid) return;
    const { title, due } = this.form.getRawValue();
    const created = this.assignmentsService.create(title, new Date(due).toISOString());
    this.closed.emit();
    this.router.navigate(['/app/assignments', created.id]);
  }
}
