# Use Case 6: Quickly Create New Items

**Story**: US-DASHBOARD-001 (Dashboard Overview)

**Primary Actor**: Developer/Agency Owner

**Goal**: Rapidly add new clients, projects, tasks, or communications without navigating through menus

## Preconditions
- User is viewing the dashboard
- User needs to create a new item

## Main Success Scenario
1. User sees quick action buttons on dashboard
2. User identifies the type of item they want to create (client, contact, project, task, or communication)
3. User clicks the corresponding quick action button
4. System navigates to the appropriate creation form
5. User completes the form and saves the new item
6. System returns user to dashboard with updated information

## Extensions
- 2a. If user is unsure which item to create: User can browse available actions and select appropriate one
- 5a. If user cancels creation: System returns to dashboard without saving

## Success Guarantee
User can create new items quickly without navigating through multiple menus

## Acceptance Criteria

### AC1: Quick Actions Component
**Given** I am viewing the dashboard
**When** the page loads
**Then** I should see a section titled "Quick Actions"
**And** the section should contain clearly labeled buttons for:
- "Add Client"
- "Add Contact"
- "Add Project"
- "Add Task"
- "Log Communication"

### AC2: Navigation to Creation Forms
**Given** I click a quick action button
**When** the button action is triggered
**Then** the system should navigate to the appropriate route:
- "Add Client" → /clients/new
- "Add Contact" → /contacts/new
- "Add Project" → /projects/new
- "Add Task" → /tasks/new
- "Log Communication" → /communications/new

### AC3: Return to Dashboard After Creation
**Given** I navigate from dashboard to a creation form via quick action
**When** I successfully save the new item
**Then** the system should navigate back to the dashboard
**And** the dashboard data should refresh to show the newly created item

### AC4: Return to Dashboard on Cancel
**Given** I navigate from dashboard to a creation form via quick action
**When** I cancel the creation (without saving)
**Then** the system should navigate back to the dashboard
**And** no new item should be created

### AC5: Visual Design
**Given** I am viewing the quick actions section
**Then** the buttons should be:
- Visually distinct and prominent
- Consistently styled
- Include appropriate icons (optional)
- Accessible (keyboard navigable, screen reader friendly)
- Responsive (work on mobile, tablet, and desktop)

## Technical Implementation

### Frontend Changes

**Component**: `QuickActionsComponent` (apps/frontend/src/app/features/dashboard/components/quick-actions/)

```typescript
@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button class="action-btn" [routerLink]="['/clients/new']">
          Add Client
        </button>
        <button class="action-btn" [routerLink]="['/contacts/new']">
          Add Contact
        </button>
        <button class="action-btn" [routerLink]="['/projects/new']">
          Add Project
        </button>
        <button class="action-btn" [routerLink]="['/tasks/new']">
          Add Task
        </button>
        <button class="action-btn" [routerLink]="['/communications/new']">
          Log Communication
        </button>
      </div>
    </section>
  `
})
export class QuickActionsComponent {}
```

**Integration**: Add `<app-quick-actions />` to `DashboardPageComponent` template

**Routing**: Ensure all target routes exist:
- `/clients/new` (should already exist)
- `/contacts/new` (should already exist)
- `/projects/new` (should already exist)
- `/tasks/new` (should already exist)
- `/communications/new` (should already exist)

**Navigation After Save**: Each creation form should navigate back to `/dashboard` after successful save

### Styling Requirements

- Grid layout for buttons (responsive: 5 columns desktop, 2-3 tablet, 1-2 mobile)
- Prominent, clickable button design
- Hover and focus states
- Sufficient spacing between buttons
- Optional: Icon for each action type
- Consistent with overall dashboard design

### Testing

**Component Tests**:
- Quick actions component renders all 5 buttons
- Each button has correct label
- Each button has correct routerLink
- Component is accessible (keyboard navigation, ARIA labels)

**Integration Tests**:
- Clicking each button navigates to correct route
- After creating item, dashboard refreshes and shows new item
- After canceling creation, user returns to dashboard

## Dependencies

**Existing Functionality**:
- ✅ All creation routes should already exist (clients, contacts, projects, tasks, communications)
- ✅ Dashboard page component exists
- ✅ Router configuration

**New Functionality**:
- QuickActionsComponent (new)
- Navigation logic from creation forms back to dashboard (may need updates)

## Definition of Done

- [ ] QuickActionsComponent created with all 5 action buttons
- [ ] Component integrated into DashboardPageComponent
- [ ] All buttons navigate to correct routes
- [ ] Buttons are properly styled and responsive
- [ ] Component is accessible (keyboard navigation, screen readers)
- [ ] After creating item, system navigates back to dashboard
- [ ] After canceling creation, system navigates back to dashboard
- [ ] Dashboard data refreshes after item creation
- [ ] Component tests written and passing
- [ ] Manual testing on different screen sizes
- [ ] Code follows Angular best practices (standalone, signals, modern syntax)

## Notes

- This is primarily a UI/navigation feature
- No new backend queries or commands required
- Focus on clean, intuitive UX
- Consider adding icons to buttons for better visual recognition
- Ensure consistent navigation patterns across all creation forms
