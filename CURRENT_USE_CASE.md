# Use Case 8: View Action Items for a Specific Client

**Primary Actor**: Developer or Agency Owner

**Goal**: See all action items related to a specific client across all their projects to understand what needs to be done for that client relationship

**Preconditions**:
- User has access to the task management system
- The client exists in the system

**Main Success Scenario**:
1. User is reviewing client information (from client management features)
2. System displays section showing action items for this client
3. System lists all action items associated with the client with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - When it's due (deadline with alert if overdue)
   - Which project it relates to (if any)
4. User reviews client-specific action items across all projects
5. User can navigate to any action item for full details (Use Case 3)

**Extensions**:
- 2a. If no action items exist for this client:
  - 2a1. System displays message indicating no action items for this client
  - 2a2. System offers option to record a new action item for this client
- 4a. If user wants to add action item for this client:
  - 4a1. User requests to add new action item
  - 4a2. System starts Use Case 1 with client pre-selected

**Success Guarantee**: User sees all action items across all work for the client
