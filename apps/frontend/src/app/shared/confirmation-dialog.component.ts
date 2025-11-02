import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="dialog-backdrop"
      role="dialog"
      aria-modal="true"
      [attr.aria-labelledby]="'dialog-title'"
      (click)="onCancel()"
      (keydown.escape)="onCancel()"
      tabindex="0"
    >
      <div
        class="dialog-container"
        (click)="$event.stopPropagation()"
        (keydown)="$event.stopPropagation()"
        tabindex="-1"
      >
        <div class="dialog-header">
          <h3 id="dialog-title">{{ title() }}</h3>
        </div>

        <div class="dialog-content">
          <p>{{ message() }}</p>
        </div>

        <div class="dialog-actions">
          <button class="cancel-button" (click)="onCancel()">
            {{ cancelText() }}
          </button>
          <button class="confirm-button" (click)="onConfirm()">
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-container {
      background: white;
      border-radius: 8px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .dialog-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }

    .dialog-content {
      padding: 1.5rem;
    }

    .dialog-content p {
      margin: 0;
      color: #555;
      line-height: 1.5;
    }

    .dialog-actions {
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .cancel-button, .confirm-button {
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cancel-button {
      background-color: #6c757d;
      color: white;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }

    .confirm-button {
      background-color: #dc3545;
      color: white;
    }

    .confirm-button:hover {
      background-color: #c82333;
    }
  `]
})
export class ConfirmationDialogComponent {
  // Inputs using modern signal-based API
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');

  // Outputs using modern output() function
  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
