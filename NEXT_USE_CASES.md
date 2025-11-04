# Use Cases: Task Management (Alistair Cockburn Style)

## Use Case 8: View Action Items for a Specific Client

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

---

## Use Case 9: Identify Overdue Action Items

**Primary Actor**: Developer or Agency Owner

**Goal**: Quickly identify all action items that have missed their deadlines and need immediate attention

**Preconditions**: User has access to the task management system

**Main Success Scenario**:
1. User requests to see overdue action items
2. System identifies all action items where:
   - Deadline has passed
   - Current state is To Do or In Progress (not Completed or Cancelled)
3. System displays overdue action items with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - How long overdue (e.g., "overdue by 3 days")
   - Which client or project it relates to (if any)
4. User reviews overdue items to prioritize immediate work
5. User can navigate to any action item for full details (Use Case 3)

**Extensions**:
- 2a. If no action items are overdue:
  - 2a1. System displays message confirming all action items are on track
- 3a. If user is viewing all action items (Use Case 2):
  - 3a1. System visually highlights overdue items in the list
  - 3a2. System displays overdue alert with each overdue item

**Success Guarantee**: User can identify and prioritize overdue work requiring immediate attention

---

## Use Case 10: Search for Action Items by Description

**Primary Actor**: Developer or Agency Owner

**Goal**: Find specific action items by remembering keywords from their description

**Preconditions**: User has access to the task management system

**Main Success Scenario**:
1. User is viewing action items (Use Case 2)
2. User enters keywords they remember from an action item's title
3. System filters the display to show only action items containing those keywords
4. User sees matching action items
5. User can navigate to any action item for full details (Use Case 3)

**Extensions**:
- 3a. If no action items match the keywords:
  - 3a1. System displays message indicating no matches found
  - 3a2. User can modify search keywords and try again
- 4a. If user clears the search:
  - 4a1. System returns to showing all action items

**Success Guarantee**: User can locate specific action items based on remembered keywords
