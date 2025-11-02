import { Component, ChangeDetectionStrategy, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './confirmation-dialog.component.scss',
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
  `
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
