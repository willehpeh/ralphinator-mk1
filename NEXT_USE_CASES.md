# Use Cases: Complete Project Management CRUD Operations

## Use Case 5: Change Project Status Through Lifecycle

**Primary Actor**: Developer or Agency Owner

**Goal**: Update project status as work progresses through different lifecycle stages

**Preconditions**:
- User is viewing a project detail page
- Project is not deleted

**Main Success Scenario**:
1. User clicks "Change Status" action
2. System displays status options (Planning, Active, On Hold, Completed, Cancelled)
3. User selects new status
4. System validates the status change
5. User confirms the status change
6. System updates project status and records the change in history
7. System displays confirmation message with updated status badge

**Extensions**:
- 3a. User changes status to Completed: System prompts for actual end date if not already set
- 3b. User changes status to Cancelled: System prompts for actual end date and reason (optional)
- 4a. Status transition violates business rules: System displays validation message (if rules exist)
- 6a. Status change triggers workflow: System executes related business processes (future)

**Success Guarantee**: Project status accurately reflects current state and status change is recorded in history

---

## Use Case 6: Remove Project from Active Portfolio

**Primary Actor**: Developer or Agency Owner

**Goal**: Remove a completed or cancelled project from active view while preserving historical records

**Preconditions**:
- User is viewing a project detail page
- Project has no associated tasks (future constraint)

**Main Success Scenario**:
1. User clicks "Delete Project" button
2. System displays confirmation dialog explaining the project will be archived
3. User confirms deletion
4. System marks project as deleted (soft delete)
5. System preserves complete project history via event sourcing
6. System displays confirmation and redirects to projects list
7. System excludes deleted project from standard project views

**Extensions**:
- 3a. User cancels deletion: System returns to project detail page with no changes
- 4a. Project has associated tasks: System displays error preventing deletion with explanation
- 5a. User needs to restore project: Contact system administrator (future: self-service restore)

**Success Guarantee**: Project is removed from active views but complete audit trail is preserved in event store

---

## Use Case Ordering and Dependencies

The use cases are ordered by typical user workflow:

1. ✅ **View All Projects** - First interaction: understanding what projects exist (COMPLETE)
2. ✅ **Find Projects** - Refinement: locating specific projects in a larger portfolio (COMPLETE)
3. ✅ **View Project Detail** - Deep dive: examining specific project information (COMPLETE)
4. ✅ **Update Project Details** - Maintenance: keeping project information current (COMPLETE)
5. **Change Project Status** - Lifecycle management: progressing projects through stages
6. **Remove Project** - Cleanup: archiving completed or obsolete projects

All use cases are independently valuable and can be implemented in any order, though implementing them in sequence provides the most natural user experience.
