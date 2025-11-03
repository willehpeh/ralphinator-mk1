# Use Case 6: Remove Project from Active Portfolio

## Status: IN PROGRESS

**Primary Actor**: Developer or Agency Owner
**Goal**: Remove a completed or cancelled project from active view while preserving historical records

## Tasks Completed

### Task 1: Create ProjectDeletedDomainEvent ✅
- Created `packages/domain/src/lib/events/project-deleted.domain-event.ts`
- Event captures project deletion with aggregateId and eventVersion
- Added DELETED constant to `PROJECT_EVENT_TYPES`
- Commit: `ec596e7 feat: Add ProjectDeletedDomainEvent for soft delete tracking`

### Task 2: Add delete() method to ProjectAggregate ✅
- Added `delete()` method to `ProjectAggregate` to mark project as deleted
- Added private `deleted` field to track deletion state
- Registered `ProjectDeletedDomainEvent` handler in constructor
- Added `onProjectDeleted()` event handler to set deleted flag to true
- Added `isDeleted()` getter for accessing deletion state
- Imported `ProjectDeletedDomainEvent`
- Commit: `622b2b3 feat: Add delete() method to ProjectAggregate for soft delete`

### Task 3: Create DeleteProjectCommand and Handler ✅
- Created `packages/application/src/lib/commands/delete-project.command.ts`
- Created `packages/application/src/lib/commands/handlers/delete-project.handler.ts`
- Handler loads aggregate from event store, calls delete(), persists events
- Exported command and handler from application layer
- Commit: `27ab4d1 feat: Add DeleteProjectCommand and handler for soft delete`

### Task 4: Update ProjectProjection to handle ProjectDeletedDomainEvent ✅
- Added `delete(id: string)` method to `IProjectReadRepository` interface
- Implemented `delete()` method in `InMemoryProjectReadRepository`
- Imported `ProjectDeletedDomainEvent` in `ProjectProjection`
- Added `ProjectDeletedDomainEvent` to `@EventsHandler` decorator
- Registered event handler in constructor: `[PROJECT_EVENT_TYPES.DELETED]: this.onProjectDeleted.bind(this)`
- Implemented `onProjectDeleted()` event handler to call `projectReadRepository.delete()`
- Commit: `98dbb94 feat: Add ProjectProjection handler for ProjectDeletedDomainEvent`

### Task 5: Add DELETE API endpoint ✅
- Added `Delete` decorator import from `@nestjs/common`
- Imported `DeleteProjectCommand` from `@angular-nest-starter/application`
- Added `@Delete(':projectId')` endpoint to `ProjectsController`
- Accepts project ID from URL params
- Executes `DeleteProjectCommand` via command bus
- Returns success response `{ id: string }`
- Endpoint URL: `DELETE /api/clients/:clientId/projects/:projectId`
- Commit: `ec4fe3e feat: Add DELETE endpoint for project deletion`

### Task 6: Add deleteProject method to ProjectsService (Frontend) ✅
- Added `deleteProject(clientId: string, projectId: string)` method to `ProjectsService`
- Method calls HTTP DELETE to `/api/clients/${clientId}/projects/${projectId}`
- Returns `Observable<{ id: string }>`
- Added JSDoc comment documenting soft delete behavior
- Located in `apps/frontend/src/app/projects/projects.service.ts:62-64`
- Commit: `15cbacf feat: Add deleteProject method to ProjectsService`

### Task 7: Add Delete button to ProjectDetailComponent ✅
- Added "Delete Project" button to header actions section in template
- Button styled with red/danger aesthetic (`.delete-button` class)
- Button triggers `openDeleteDialog()` method when clicked
- Added `openDeleteDialog()` method stub (to be implemented in Task 8)
- Updated SCSS with `.delete-button` styles (red background #e53e3e, hover #c53030)
- Updated mobile responsive styles to include delete button
- Located in `apps/frontend/src/app/projects/project-detail.component.ts:57-59,241-244`
- Located in `apps/frontend/src/app/projects/project-detail.component.scss:127-145,273-277`

### Task 8: Implement confirmation dialog for project deletion ✅
- Imported `ConfirmationDialogComponent` (reused existing component)
- Added `showDeleteDialog` signal to control dialog visibility
- Implemented `openDeleteDialog()` method to show dialog
- Implemented `onDeleteConfirmed()` method stub (calls actual delete in Task 9)
- Implemented `onDeleteCancelled()` method to close dialog
- Added confirmation dialog to template with appropriate message
- Dialog displays: "Are you sure you want to delete this project? The project will be archived and removed from active views, but the complete history will be preserved."
- Confirm button text: "Delete", Cancel button text: "Cancel"
- Located in `apps/frontend/src/app/projects/project-detail.component.ts:10,14,160,243-255,149-158`
- Commit: `03517ac feat: Add confirmation dialog for project deletion`

## Tasks Remaining

### Task 9: Integrate delete functionality in ProjectDetailComponent
- Call `deleteProject()` on confirmation
- Show loading state during deletion
- Handle success: navigate to projects list
- Handle error: display error message

## Success Criteria

- [ ] User can click "Delete Project" button on project detail page
- [ ] System displays confirmation dialog explaining archive
- [ ] User can confirm or cancel deletion
- [ ] System marks project as deleted (soft delete)
- [ ] System preserves complete project history via event sourcing
- [ ] System displays confirmation and redirects to projects list
- [ ] System excludes deleted project from standard project views

## Notes

- Soft delete pattern: Project remains in event store, removed from read models
- Event sourcing preserves complete audit trail
- Future enhancement: Self-service restore functionality
- Future constraint: Prevent deletion of projects with associated tasks
