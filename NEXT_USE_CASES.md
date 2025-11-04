# Use Cases: Task Management (Alistair Cockburn Style)


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
