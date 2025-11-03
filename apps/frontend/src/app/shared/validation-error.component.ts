import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Reusable component for displaying form validation errors.
 * Reduces duplication across form components by providing a consistent
 * validation error display pattern.
 *
 * @example
 * ```html
 * <input id="name" formControlName="name" />
 * <app-validation-error
 *   [control]="form.controls.name"
 *   requiredMessage="Name is required"
 *   emailMessage="Please enter a valid email" />
 * ```
 */
@Component({
  selector: 'app-validation-error',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control().invalid && control().touched) {
      <div class="validation-error">
        @if (control().hasError('required')) {
          {{ requiredMessage() }}
        }
        @if (control().hasError('email')) {
          {{ emailMessage() }}
        }
        @if (control().hasError('minlength')) {
          {{ minlengthMessage() }}
        }
        @if (control().hasError('maxlength')) {
          {{ maxlengthMessage() }}
        }
        @if (control().hasError('min')) {
          {{ minMessage() }}
        }
        @if (control().hasError('max')) {
          {{ maxMessage() }}
        }
        @if (control().hasError('pattern')) {
          {{ patternMessage() }}
        }
      </div>
    }
  `,
  styles: [`
    .validation-error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `]
})
export class ValidationErrorComponent {
  /**
   * The form control to check for validation errors
   */
  control = input.required<AbstractControl>();

  /**
   * Message to display when the required validator fails
   */
  requiredMessage = input<string>('This field is required');

  /**
   * Message to display when the email validator fails
   */
  emailMessage = input<string>('Please enter a valid email address');

  /**
   * Message to display when the minlength validator fails
   */
  minlengthMessage = input<string>('Value is too short');

  /**
   * Message to display when the maxlength validator fails
   */
  maxlengthMessage = input<string>('Value is too long');

  /**
   * Message to display when the min validator fails
   */
  minMessage = input<string>('Value is too small');

  /**
   * Message to display when the max validator fails
   */
  maxMessage = input<string>('Value is too large');

  /**
   * Message to display when the pattern validator fails
   */
  patternMessage = input<string>('Invalid format');
}
