# Use Case 7: Remove a Client from the System

- **Primary Actor**: Developer/CRM User
- **Goal**: Delete a client record that is no longer needed
- **Preconditions**: Client exists in the system; user is viewing client details
- **Main Success Scenario**:
  1. User views client detail view
  2. User clicks "Delete Client" button
  3. System displays confirmation dialog asking "Are you sure you want to delete this client?"
  4. User confirms deletion
  5. System removes the client from the system
  6. System displays confirmation message
  7. System navigates user back to client list view
  8. Deleted client no longer appears in the list
- **Extensions**:
  - 4a. If user cancels deletion:
    - System closes confirmation dialog
    - System returns to client detail view with no changes
  - 5a. If client no longer exists (already deleted):
    - System displays error message "Client not found"
    - System returns user to client list
- **Success Guarantee**: Client record is permanently removed from the system and no longer appears in any views
