import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationReadModel } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-recent-communications',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="recent-communications-section">
      <header class="section-header">
        <h2>Recent Communications</h2>
        <p class="section-subtitle">Last 10 client interactions</p>
      </header>

      @if (communications().length === 0) {
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="empty-message">No communications yet</p>
          <p class="empty-submessage">Log your first client interaction to see it here</p>
        </div>
      } @else {
        <div class="communications-list">
          @for (communication of communications(); track communication.id) {
            <div class="communication-card">
              <div class="communication-header">
                <span class="type-badge" [class]="'type-badge--' + getBadgeClass(communication.type)">
                  {{ communication.type }}
                </span>
                <span class="communication-date">{{ formatDate(communication.communicationDate) }}</span>
              </div>

              <h3 class="communication-subject">{{ communication.subject }}</h3>

              <div class="communication-meta">
                <div class="meta-item">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ communication.clientName }}</span>
                </div>

                @if (communication.contactName) {
                  <div class="meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ communication.contactName }}</span>
                  </div>
                }

                @if (communication.projectName) {
                  <div class="meta-item">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ communication.projectName }}</span>
                  </div>
                }
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
    .recent-communications-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 0.25rem 0;
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
      padding: 3rem 1rem;
      text-align: center;
    }

    .empty-icon {
      width: 48px;
      height: 48px;
      color: #bdbdbd;
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

    .communications-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .communication-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .communication-card:hover {
      border-color: #1976d2;
      box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
    }

    .communication-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.5rem;
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

    .communication-date {
      font-size: 0.875rem;
      color: #666;
    }

    .communication-subject {
      font-size: 1rem;
      font-weight: 500;
      color: #1a1a1a;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }

    .communication-meta {
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
    }

    .view-all-link:hover {
      color: #1565c0;
      text-decoration: underline;
    }
  `],
})
export class RecentCommunicationsComponent {
  communications = input.required<CommunicationReadModel[]>();

  getBadgeClass(type: string): string {
    return type.toLowerCase();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const communicationDate = new Date(date);
    communicationDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - communicationDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
}
