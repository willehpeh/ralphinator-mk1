import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommunicationsService } from './communications.service';
import { CommunicationReadModel, CommunicationType } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-communications-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './communications-list.component.scss',
  template: `
    <div class="communications-list-container">
      <div class="communications-list-header">
        <h1>Communication History</h1>
        <button type="button" class="add-communication-button" (click)="onAddCommunication()">
          Add Communication
        </button>
      </div>

      @if (loading()) {
        <div class="loading">Loading communications...</div>
      }

      @if (error()) {
        <div class="error">
          <p>Failed to load communications: {{ error() }}</p>
          <button type="button" (click)="loadCommunications()">Retry</button>
        </div>
      }

      @if (!loading() && !error()) {
        @if (communications().length === 0) {
          <div class="empty-state">
            <p>No communications recorded yet.</p>
            <button type="button" (click)="onAddCommunication()">Add First Communication</button>
          </div>
        } @else {
          <div class="communications-count">
            {{ communications().length }} {{ communications().length === 1 ? 'communication' : 'communications' }}
          </div>

          <div class="communications-grid">
            @for (comm of communications(); track comm.id) {
              <div class="communication-card" (click)="viewCommunication(comm.id)">
                <div class="card-header">
                  <span class="type-badge" [class]="getTypeBadgeClass(comm.type)">
                    {{ comm.type }}
                  </span>
                  <span class="date">{{ formatDate(comm.communicationDate) }}</span>
                </div>

                <h3 class="subject">{{ comm.subject }}</h3>

                <div class="card-details">
                  @if (comm.clientId) {
                    <div class="detail-item">
                      <span class="label">Client:</span>
                      <span class="value">{{ comm.clientId }}</span>
                    </div>
                  }

                  @if (comm.followUpRequired) {
                    <div class="follow-up-indicator">
                      <span class="follow-up-badge">Follow-up Required</span>
                      @if (comm.followUpDate) {
                        <span class="follow-up-date">{{ formatDate(comm.followUpDate) }}</span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class CommunicationsListComponent implements OnInit {
  private router = inject(Router);
  private communicationsService = inject(CommunicationsService);

  // State signals
  communications = signal<CommunicationReadModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCommunications();
  }

  loadCommunications(): void {
    this.loading.set(true);
    this.error.set(null);

    this.communicationsService.getAllCommunications().subscribe({
      next: (data) => {
        this.communications.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An error occurred');
        this.loading.set(false);
      }
    });
  }

  onAddCommunication(): void {
    this.router.navigate(['/communications/add']);
  }

  viewCommunication(id: string): void {
    this.router.navigate(['/communications', id]);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTypeBadgeClass(type: CommunicationType): string {
    const baseClass = 'type-';
    switch (type) {
      case 'Call':
        return baseClass + 'call';
      case 'Email':
        return baseClass + 'email';
      case 'Meeting':
        return baseClass + 'meeting';
      case 'Chat':
        return baseClass + 'chat';
      case 'Other':
        return baseClass + 'other';
      default:
        return baseClass + 'default';
    }
  }
}
