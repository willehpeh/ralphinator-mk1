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

## Tasks Remaining

### Task 3: Create DeleteProjectCommand and Handler
- Create `packages/application/src/commands/delete-project.command.ts`
- Create `packages/application/src/commands/handlers/delete-project.handler.ts`
- Handler loads aggregate, calls delete(), persists events

### Task 4: Update ProjectProjection to handle ProjectDeletedDomainEvent
- Add event handler to `packages/infrastructure/src/projections/project.projection.ts`
- Remove project from read model when ProjectDeletedDomainEvent is received
- Use `IProjectReadRepository.delete()` method

### Task 5: Add DELETE API endpoint
- Add `DELETE /api/projects/:id` endpoint to `ProjectsController`
- Accept project ID in URL params
- Return success response `{ id: string }`

### Task 6: Add deleteProject method to ProjectsService (Frontend)
- Add `deleteProject(id: string)` method to `ProjectsService`
- Return `Observable<{ id: string }>`

### Task 7: Add Delete button to ProjectDetailComponent
- Add "Delete Project" button to project detail view
- Button triggers confirmation dialog

### Task 8: Implement confirmation dialog for project deletion
- Create or reuse confirmation dialog component
- Dialog explains project will be archived (soft delete)
- Confirm and Cancel buttons

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
