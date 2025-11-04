import { Component, ChangeDetectionStrategy, output, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectStatus, PROJECT_STATUS_VALUES } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-status-change-dialog',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './status-change-dialog.component.scss',
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
          <h3 id="dialog-title">Change Project Status</h3>
        </div>

        <div class="dialog-content">
          <label for="status-select" class="status-label">
            Select new status:
          </label>
          <select
            id="status-select"
            class="status-select"
            [(ngModel)]="selectedStatus"
            (change)="onStatusChange()"
          >
            @for (status of availableStatuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>

          @if (currentStatus() === selectedStatus()) {
            <p class="warning-message">
              This is the current status. Please select a different status to make a change.
            </p>
          }
        </div>

        <div class="dialog-actions">
          <button class="cancel-button" (click)="onCancel()">
            Cancel
          </button>
          <button
            class="confirm-button"
            (click)="onConfirm()"
            [disabled]="currentStatus() === selectedStatus()"
          >
            Change Status
          </button>
        </div>
      </div>
    </div>
  `
})
export class StatusChangeDialogComponent implements OnInit {
  // Inputs
  currentStatus = input.required<ProjectStatus>();

  // Outputs
  statusChanged = output<ProjectStatus>();
  cancelled = output<void>();

  // Local state
  selectedStatus = signal<ProjectStatus>(this.currentStatus());
  readonly availableStatuses = PROJECT_STATUS_VALUES;

  ngOnInit(): void {
    // Initialize selected status with current status
    this.selectedStatus.set(this.currentStatus());
  }

  onStatusChange(): void {
    // Signal is updated by ngModel binding
  }

  onConfirm(): void {
    const newStatus = this.selectedStatus();
    if (newStatus !== this.currentStatus()) {
      this.statusChanged.emit(newStatus);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
