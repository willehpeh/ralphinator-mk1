import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * Typed interface for contact form fields.
 * Used by contact creation and editing forms throughout the application.
 */
export interface ContactFormFields {
  name: FormControl<string>;
  role: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}

/**
 * Creates a new FormGroup for contact data with standard validation rules.
 *
 * Validation rules:
 * - name: required
 * - role: optional
 * - email: optional, but must be valid email format if provided
 * - phone: optional
 *
 * @returns A typed FormGroup ready for contact data entry
 */
export function createContactFormGroup(): FormGroup<ContactFormFields> {
  return new FormGroup<ContactFormFields>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    role: new FormControl('', { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email]
    }),
    phone: new FormControl('', { nonNullable: true })
  });
}
