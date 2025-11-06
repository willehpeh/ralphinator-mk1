import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button class="action-btn action-btn--client" [routerLink]="['/clients/add']">
          <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Add Client</span>
        </button>

        <button class="action-btn action-btn--contact" [routerLink]="['/contacts']">
          <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>View Contacts</span>
        </button>

        <button class="action-btn action-btn--project" [routerLink]="['/projects']">
          <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="14" y="3" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="14" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="14" width="7" height="7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>View Projects</span>
        </button>

        <button class="action-btn action-btn--task" [routerLink]="['/tasks/add']">
          <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11l3 3L22 4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Add Task</span>
        </button>

        <button class="action-btn action-btn--communication" [routerLink]="['/communications']">
          <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>View Communications</span>
        </button>
      </div>
    </section>
  `,
  styles: [`
    .quick-actions {
      margin-bottom: 2rem;
    }

    .quick-actions h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
    }

    @media (max-width: 1024px) {
      .actions-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 640px) {
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 400px) {
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }

    .action-btn {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.25rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1a1a1a;
      min-height: 88px;
      min-width: 88px;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: currentColor;
    }

    .action-btn:focus {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }

    .action-btn:active {
      transform: translateY(0);
    }

    .action-icon {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .action-btn--client {
      color: #1976d2;
    }

    .action-btn--client:hover {
      background: #e3f2fd;
      border-color: #1976d2;
    }

    .action-btn--contact {
      color: #7b1fa2;
    }

    .action-btn--contact:hover {
      background: #f3e5f5;
      border-color: #7b1fa2;
    }

    .action-btn--project {
      color: #388e3c;
    }

    .action-btn--project:hover {
      background: #e8f5e9;
      border-color: #388e3c;
    }

    .action-btn--task {
      color: #f57c00;
    }

    .action-btn--task:hover {
      background: #fff3e0;
      border-color: #f57c00;
    }

    .action-btn--communication {
      color: #0288d1;
    }

    .action-btn--communication:hover {
      background: #e1f5fe;
      border-color: #0288d1;
    }
  `],
})
export class QuickActionsComponent {}
