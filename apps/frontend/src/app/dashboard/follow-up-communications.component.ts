import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationReadModel } from '@angular-nest-starter/shared-types';

interface FollowUpWithUrgency extends CommunicationReadModel {
  daysUntil: number;
  isOverdue: boolean;
  urgencyLevel: 'critical' | 'warning' | 'normal';
}

@Component({
  selector: 'app-follow-up-communications',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="follow-up-section">
      <header class="section-header">
        <h2>Follow-Ups Required</h2>
        <p class="section-subtitle">
          @if (followUps().length > 0) {
            {{ followUps().length }} {{ followUps().length === 1 ? 'communication' : 'communications' }} requiring follow-up
          } @else {
            All follow-ups are complete
          }
        </p>
      </header>

      @if (followUps().length === 0) {
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="empty-message">All caught up!</p>
          <p class="empty-submessage">No follow-ups are currently required</p>
        </div>
      } @else {
        <div class="follow-ups-list">
          @for (followUp of enrichedFollowUps(); track followUp.id) {
            <div class="follow-up-card" [class.overdue]="followUp.isOverdue" [attr.data-urgency]="followUp.urgencyLevel">
              <div class="follow-up-header">
                <span class="type-badge" [class]="'type-badge--' + getBadgeClass(followUp.type)">
                  {{ followUp.type }}
                </span>
                <span class="urgency-indicator" [class]="'urgency-indicator--' + followUp.urgencyLevel">
                  @if (followUp.isOverdue) {
                    <svg class="urgency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ Math.abs(followUp.daysUntil) }} {{ Math.abs(followUp.daysUntil) === 1 ? 'day' : 'days' }} overdue
                  } @else {
                    <svg class="urgency-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <polyline points="12 6 12 12 16 14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ followUp.daysUntil }} {{ followUp.daysUntil === 1 ? 'day' : 'days' }} until due
                  }
                </span>
              </div>

              <h3 class="follow-up-subject">{{ followUp.subject }}</h3>

              <div class="follow-up-meta">
                <div class="meta-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ followUp.clientName }}</span>
                </div>

                @if (followUp.contactName) {
                  <div class="meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ followUp.contactName }}</span>
                  </div>
                }

                <div class="meta-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Follow-up: {{ formatFollowUpDate(followUp.followUpDate!) }}</span>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="section-footer">
          <a href="#" class="view-all-link">View All Communications →</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .follow-up-section {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 640px) {
      .follow-up-section {
        padding: 1.5rem;
      }
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
    }

    @media (min-width: 640px) {
      .section-header h2 {
        font-size: 1.5rem;
      }
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
    }

    @media (min-width: 640px) {
      .empty-state {
        padding: 3rem 1rem;
      }
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: #4caf50;
      margin-bottom: 1rem;
    }

    .empty-message {
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
    }

    .empty-submessage {
      font-size: 0.875rem;
      color: #666;
      margin: 0;
    }

    .follow-ups-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .follow-up-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }

    @media (min-width: 640px) {
      .follow-up-card {
        padding: 1rem;
      }
    }

    .follow-up-card:hover {
      border-color: #1976d2;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
      transform: translateY(-1px);
    }

    .follow-up-card.overdue {
      border-left: 4px solid #f44336;
      background: #fff5f5;
    }

    .follow-up-card[data-urgency="critical"] {
      border-left: 4px solid #d32f2f;
      background: #ffebee;
    }

    .follow-up-card[data-urgency="warning"] {
      border-left: 4px solid #ff9800;
      background: #fff8e1;
    }

    .follow-up-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .type-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 12px;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .type-badge--call {
      background: #e3f2fd;
      color: #1976d2;
    }

    .type-badge--email {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .type-badge--meeting {
      background: #e8f5e9;
      color: #388e3c;
    }

    .type-badge--chat {
      background: #fff3e0;
      color: #f57c00;
    }

    .type-badge--other {
      background: #eceff1;
      color: #546e7a;
    }

    .urgency-indicator {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 12px;
      white-space: nowrap;
    }

    .urgency-indicator--critical {
      background: #ffebee;
      color: #c62828;
    }

    .urgency-indicator--warning {
      background: #fff8e1;
      color: #ef6c00;
    }

    .urgency-indicator--normal {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .urgency-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .follow-up-subject {
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }

    .follow-up-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .section-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      text-align: center;
    }

    .view-all-link {
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      transition: color 0.2s;
      display: inline-block;
      min-height: 44px;
      line-height: 44px;
    }

    .view-all-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }
  `],
})
export class FollowUpCommunicationsComponent {
  followUps = input.required<CommunicationReadModel[]>();

  // Expose Math for template
  Math = Math;

  /**
   * Enrich follow-ups with urgency information
   */
  enrichedFollowUps = computed<FollowUpWithUrgency[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.followUps().map(followUp => {
      const followUpDate = new Date(followUp.followUpDate!);
      followUpDate.setHours(0, 0, 0, 0);

      const diffTime = followUpDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isOverdue = daysUntil < 0;

      let urgencyLevel: 'critical' | 'warning' | 'normal';
      if (isOverdue) {
        urgencyLevel = Math.abs(daysUntil) >= 3 ? 'critical' : 'warning';
      } else {
        urgencyLevel = daysUntil <= 2 ? 'warning' : 'normal';
      }

      return {
        ...followUp,
        daysUntil,
        isOverdue,
        urgencyLevel
      };
    });
  });

  getBadgeClass(type: string): string {
    return type.toLowerCase();
  }

  formatFollowUpDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}
