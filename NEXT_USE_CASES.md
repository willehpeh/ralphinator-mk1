# Use Cases: Complete Project Management CRUD Operations

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
5. ✅ **Change Project Status** - Lifecycle management: progressing projects through stages (COMPLETE)
6. **Remove Project** - Cleanup: archiving completed or obsolete projects

All use cases are independently valuable and can be implemented in any order, though implementing them in sequence provides the most natural user experience.
