# Use Case 2: Find Projects by Status or Client

**Primary Actor**: Developer or Agency Owner

**Goal**: Quickly locate specific projects from a potentially large portfolio by filtering projects by status, client, or name search

**Preconditions**:
- User is viewing projects list
- Multiple projects exist in the system

**Main Success Scenario**:
1. User accesses the projects list page
2. System displays all projects
3. User applies filters:
   - Selects status filter (Planning, Active, On Hold, Completed, Cancelled)
   - Selects client filter (dropdown of all clients)
   - Enters search term in name filter
4. System dynamically filters projects to match selected criteria
5. System displays count of matching projects
6. User reviews filtered results
7. User clears filters to return to full list

**Extensions**:
- 3a. User combines multiple filters: System applies AND logic (status AND client AND name search)
- 4a. No projects match filters: System displays "No projects found" message with clear filters option
- 7a. User clicks "Clear Filters" button: System resets all filters and shows all projects

**Success Guarantee**: User can quickly find specific projects from a large portfolio using multiple filter criteria

## Technical Requirements

### Backend (Already Implemented)
- ✅ GET /api/projects endpoint exists
- ✅ IProjectReadRepository.findAll() method exists
- Need to add query parameters support for filtering:
  - ?status=active
  - ?clientId=uuid
  - ?search=keyword

### Frontend (To Implement)
- Add filter controls to ProjectsListComponent:
  - Status dropdown (All, Planning, Active, On Hold, Completed, Cancelled)
  - Client dropdown (All, + list of clients)
  - Name search input field
  - "Clear Filters" button
- Add signals for filter state management
- Update project display to show filtered results
- Add count display (e.g., "Showing 5 of 23 projects")
- Ensure filters persist during navigation (optional enhancement)

### State Management (NGRX)
- Update loadAllProjects action to accept filters
- Update effect to pass filters to API
- Add selectors for filtered projects
- Store filter state if needed

## Acceptance Criteria
1. User can filter projects by status (single selection)
2. User can filter projects by client (single selection)
3. User can search projects by name (text input)
4. Filters work in combination (AND logic)
5. Project count updates dynamically as filters change
6. "Clear Filters" button resets all filters
7. Empty state displays when no projects match filters
8. Filter UI is intuitive and responsive
