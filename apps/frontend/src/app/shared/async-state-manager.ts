import { signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Manages async operation state (loading, error, data) with a consistent pattern.
 * Eliminates boilerplate for common loading/error state management.
 *
 * @example
 * ```typescript
 * contactState = new AsyncStateManager<Contact>();
 *
 * loadContact(id: string): void {
 *   this.contactState.execute(
 *     this.clientsService.getContactById(id),
 *     'Failed to load contact details'
 *   );
 * }
 * ```
 */
export class AsyncStateManager<T> {
  readonly data = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Executes an observable and manages the full lifecycle of loading/error/data states.
   *
   * @param observable$ The observable to execute
   * @param errorMessage User-friendly error message to display on failure
   * @param onSuccess Optional callback to execute on successful data retrieval
   */
  execute(
    observable$: Observable<T>,
    errorMessage: string,
    onSuccess?: (data: T) => void
  ): void {
    this.loading.set(true);
    this.error.set(null);

    observable$.subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      error: (err) => {
        console.error(errorMessage, err);
        this.error.set(errorMessage);
        this.loading.set(false);
      },
    });
  }

  /**
   * Resets all state to initial values.
   */
  reset(): void {
    this.data.set(null);
    this.loading.set(false);
    this.error.set(null);
  }
}
