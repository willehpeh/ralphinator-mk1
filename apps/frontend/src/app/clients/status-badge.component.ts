import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientStatus } from './client.types';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  template: `
    <span class="status-badge" [class]="'status-' + status().toLowerCase()">
      {{ status() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<ClientStatus>();
}
