# Use Case 1: View All Projects in the System

**Primary Actor**: Developer or Agency Owner

**Goal**: See a comprehensive list of all projects across all clients to understand current workload and project portfolio

**Preconditions**:
- User is authenticated
- At least one project exists in the system

**Main Success Scenario**:
1. User navigates to the Projects section from main navigation
2. System displays list of all active projects with key information (name, client, status, dates, budget)
3. System uses color-coded badges to show project status at a glance
4. User reviews the project portfolio

**Extensions**:
- 2a. No projects exist: System displays empty state message with option to create first project
- 2b. Deleted projects are automatically excluded from the list

**Success Guarantee**: User has a clear overview of all projects in the system
