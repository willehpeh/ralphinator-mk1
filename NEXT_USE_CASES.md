# Use Cases: Client Management

## Use Case 2: Update Client Information

- **Primary Actor**: Developer/CRM User
- **Goal**: Modify existing client information to keep records current and accurate
- **Preconditions**: The client record exists in the system
- **Main Success Scenario**:
  1. User specifies which client to update (by client ID)
  2. User provides updated information (name, email, phone, status, or notes)
  3. System verifies the client exists
  4. System validates the updated information
  5. System saves the changes
  6. System confirms the update was successful
- **Extensions**:
  - 3a. If client does not exist:
    - System notifies user that client was not found
    - Use case ends in failure
  - 4a. If updated information is invalid:
    - System notifies user of validation errors
    - User corrects the information
    - Continue at step 4
- **Success Guarantee**: The client record reflects the updated information, and the change history is preserved

---

## Use Case 3: View a Specific Client's Details

- **Primary Actor**: Developer/CRM User
- **Goal**: Retrieve complete information about a specific client to review or reference
- **Preconditions**: The client record exists in the system
- **Main Success Scenario**:
  1. User requests details for a specific client (by client ID)
  2. System retrieves the client information
  3. System displays all client details (name, email, phone, status, notes, ID)
- **Extensions**:
  - 2a. If client does not exist:
    - System notifies user that client was not found
    - Use case ends (no data returned)
- **Success Guarantee**: User has access to complete, current information about the requested client

---

## Use Case 4: List All Clients

- **Primary Actor**: Developer/CRM User
- **Goal**: View all clients in the system to get an overview of business relationships
- **Preconditions**: None
- **Main Success Scenario**:
  1. User requests a list of all clients
  2. System retrieves all client records
  3. System displays the list with key information for each client
- **Extensions**:
  - 2a. If no clients exist:
    - System displays an empty list
    - System may indicate that no clients have been added yet
- **Success Guarantee**: User can see all clients currently in the system

---

## Use Case 5: Filter Clients by Status

- **Primary Actor**: Developer/CRM User
- **Goal**: View only clients matching a specific status to focus on relevant business relationships
- **Preconditions**: None
- **Main Success Scenario**:
  1. User requests a list of clients filtered by status (Active, Inactive, Prospect, or Past Client)
  2. System retrieves all clients matching the specified status
  3. System displays the filtered list
- **Extensions**:
  - 2a. If no clients match the specified status:
    - System displays an empty list
    - System may indicate that no clients have that status
  - 1a. If invalid status is provided:
    - System notifies user of valid status options
    - Use case ends in failure
- **Success Guarantee**: User can see all clients matching the requested status category

---

## Business Value Summary

These use cases establish the foundation for client relationship management by enabling users to:
1. Capture new business relationships as they form
2. Keep client information accurate as circumstances change
3. Access client details when needed for business decisions
4. Get overview of all business relationships
5. Focus on specific client segments based on relationship status

Each use case delivers independent business value and can be used in combination to support comprehensive client management workflows.
