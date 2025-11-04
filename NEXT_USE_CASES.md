# Use Cases: Task Management (Alistair Cockburn Style)

## Use Case 2: View All Tracked Action Items

**Primary Actor**: Developer or Agency Owner

**Goal**: See all action items that need attention across all work

**Preconditions**: User has access to the task management system

**Main Success Scenario**:
1. User requests to see all action items
2. System displays all recorded action items with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - When it's due (deadline with alert if overdue)
   - Which client or project it relates to (if any)
3. User reviews the list of action items

**Extensions**:
- 3a. If user wants to focus on specific types of action items:
  - 3a1. User narrows the view by urgency level (priority)
  - 3a2. User narrows the view by current state (status)
  - 3a3. User narrows the view by client
  - 3a4. User narrows the view by project
  - 3a5. User narrows the view to show only overdue items
  - 3a6. User searches by keywords in the title
  - 3a7. System updates the display to show only matching action items
- 3b. If no action items exist:
  - 3b1. System displays message indicating no action items are tracked yet
  - 3b2. System offers option to record a new action item

**Success Guarantee**: User sees current status of all relevant action items

---

## Use Case 3: Review Details of a Specific Action Item

**Primary Actor**: Developer or Agency Owner

**Goal**: Understand everything about a specific action item to decide what to do next

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User selects an action item from the list
2. System displays complete information:
   - What needs to be done (title)
   - Detailed notes about the work
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - Deadline (with alert if overdue)
   - Related client (with ability to navigate to client information)
   - Related project (with ability to navigate to project information)
   - When the action item was created
   - When it was last modified
3. User reviews the complete information
4. System offers available actions:
   - Modify the action item details
   - Mark the action as complete
   - Change the current state
   - Remove the action item from tracking

**Extensions**:
- 2a. If the deadline has passed and work is not complete:
  - 2a1. System prominently displays overdue warning
- 4a. If user decides to take an action:
  - 4a1. See Use Case 4 (Modify Action Item)
  - 4a2. See Use Case 5 (Update Action Item Progress)
  - 4a3. See Use Case 6 (Remove Action Item from Tracking)

**Success Guarantee**: User has complete context about the action item to make informed decisions

---

## Use Case 4: Modify Action Item Details

**Primary Actor**: Developer or Agency Owner

**Goal**: Update the information about an action item as circumstances change

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User is reviewing an action item (Use Case 3)
2. User requests to modify the details
3. System displays current information for editing
4. User changes one or more details:
   - Updates the title describing the action
   - Modifies the detailed notes
   - Adjusts the urgency level (priority)
   - Changes the deadline
   - Updates client or project associations
5. System validates the changes are complete and consistent
6. System records the modifications
7. System confirms the action item has been updated
8. User sees the updated action item details

**Extensions**:
- 5a. If required information is missing:
  - 5a1. System indicates what information is needed
  - 5a2. User provides missing information
  - 5a3. Continue at step 5
- 5b. If changes create inconsistency (e.g., project/client mismatch):
  - 5b1. System indicates the inconsistency
  - 5b2. User corrects the information
  - 5b3. Continue at step 5

**Success Guarantee**: Action item reflects the updated information

**Note**: This use case does NOT include changing the progress state (To Do, In Progress, etc.) - see Use Case 5 for that

---

## Use Case 5: Update Action Item Progress

**Primary Actor**: Developer or Agency Owner

**Goal**: Track progress on an action item as work proceeds

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User is reviewing an action item (Use Case 3)
2. User indicates the current progress state has changed
3. User selects new state (To Do, In Progress, Completed, or Cancelled)
4. System records the state change
5. If state changed to Completed, system records when completion occurred
6. System confirms the state has been updated
7. User sees the updated state

**Extensions**:
- 2a. If user wants to quickly mark action as complete without choosing from states:
  - 2a1. User directly marks action as complete
  - 2a2. System changes state to Completed
  - 2a3. Continue at step 5

**Success Guarantee**: Action item reflects current progress state

---

## Use Case 6: Remove Action Item from Tracking

**Primary Actor**: Developer or Agency Owner

**Goal**: Stop tracking an action item that is no longer relevant

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User is reviewing an action item (Use Case 3)
2. User requests to remove the action item from tracking
3. System asks user to confirm the removal
4. User confirms the removal
5. System removes the action item from active tracking
6. System confirms the action item has been removed
7. User is returned to the list of action items (without the removed item)

**Extensions**:
- 4a. If user decides not to remove the action item:
  - 4a1. System cancels the removal
  - 4a2. Return to Use Case 3

**Success Guarantee**: Action item is no longer visible in active tracking (though historical record may be preserved for audit purposes)

---

## Use Case 7: View Action Items for a Specific Project

**Primary Actor**: Developer or Agency Owner

**Goal**: See all action items related to a specific project to understand what needs to be done for that project

**Preconditions**:
- User has access to the task management system
- The project exists in the system

**Main Success Scenario**:
1. User is reviewing project information (from project management features)
2. System displays section showing action items for this project
3. System lists all action items associated with the project with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - When it's due (deadline with alert if overdue)
4. User reviews project-specific action items
5. User can navigate to any action item for full details (Use Case 3)

**Extensions**:
- 2a. If no action items exist for this project:
  - 2a1. System displays message indicating no action items for this project
  - 2a2. System offers option to record a new action item for this project
- 4a. If user wants to add action item for this project:
  - 4a1. User requests to add new action item
  - 4a2. System starts Use Case 1 with project pre-selected

**Success Guarantee**: User sees all action items specific to the project

---

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
