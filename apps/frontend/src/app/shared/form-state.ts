import { signal, WritableSignal } from '@angular/core';

/**
 * Standardized form state management for components with forms.
 * Provides consistent state tracking for submission status, errors, and success messages.
 */
export class FormState {
  /**
   * Indicates whether a form submission is in progress
   */
  readonly isSubmitting: WritableSignal<boolean> = signal(false);

  /**
   * Stores error messages from form submission failures
   */
  readonly error: WritableSignal<string | null> = signal(null);

  /**
   * Stores success messages from successful form submissions
   */
  readonly successMessage: WritableSignal<string | null> = signal(null);

  /**
   * Set the submitting state
   */
  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  /**
   * Set an error message and clear success message
   */
  setError(message: string | null): void {
    this.error.set(message);
    if (message) {
      this.successMessage.set(null);
    }
  }

  /**
   * Set a success message and clear error message
   * Optionally auto-hide the message after a delay
   */
  setSuccess(message: string | null, autoHideDelayMs?: number): void {
    this.successMessage.set(message);
    if (message) {
      this.error.set(null);
      if (autoHideDelayMs && autoHideDelayMs > 0) {
        setTimeout(() => {
          this.successMessage.set(null);
        }, autoHideDelayMs);
      }
    }
  }

  /**
   * Clear all messages (error and success)
   */
  clearMessages(): void {
    this.error.set(null);
    this.successMessage.set(null);
  }

  /**
   * Reset the entire form state to initial values
   */
  reset(): void {
    this.isSubmitting.set(false);
    this.clearMessages();
  }
}
