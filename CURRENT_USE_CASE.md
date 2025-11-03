# Use Case 2: Find Projects by Status or Client

**Primary Actor**: Developer or Agency Owner

**Goal**: Quickly locate specific projects by filtering based on status or client relationship

**Preconditions**:
- User is viewing the projects list
- Projects exist in the system

**Main Success Scenario**:
1. User selects a status filter (planning, active, on hold, completed, cancelled)
2. System updates the list to show only projects matching selected status
3. User optionally selects a client filter to further narrow results
4. System updates list to show projects matching both filters
5. System displays count of matching projects

**Extensions**:
- 2a. No projects match the filter: System shows empty results with suggestion to adjust filters
- 3a. User searches by project name: System combines search with other active filters
- 5a. User clears all filters: System returns to showing all projects

**Success Guarantee**: User finds the specific projects they were looking for
