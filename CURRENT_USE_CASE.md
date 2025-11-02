# Current Use Case: Search for Clients by Name

## Use Case 4: Search for Clients by Name

- **Primary Actor**: Developer/CRM User
- **Goal**: Quickly find specific clients by searching their names
- **Preconditions**: User is viewing the client list
- **Main Success Scenario**:
  1. User views client list
  2. User types search term into search box
  3. System filters the list in real-time to show only clients whose names contain the search term
  4. System displays count of matching clients
  5. User identifies the desired client
- **Extensions**:
  - 3a. If no clients match the search term:
    - System displays message "No clients found matching your search"
  - User clears the search box:
    - System displays all clients again
  - User combines search with status filter:
    - System applies both filters simultaneously
- **Success Guarantee**: User sees only clients whose names match the search term
