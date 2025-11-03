# Current Use Case: Remove a Contact from the System

**Primary Actor**: Developer or Agency Owner

**Goal**: Delete a contact record when that person is no longer relevant to track (left the company, no longer working with them, etc.)

**Preconditions**:
- The contact exists in the system
- User is viewing the contact's details

**Main Success Scenario**:
1. User indicates they want to remove this contact from the system
2. System asks user to confirm they want to permanently delete this contact
3. User confirms the deletion
4. System removes the contact from the system
5. System removes the contact from the client's contact list
6. System confirms the contact has been deleted
7. System navigates user back to either the contact list or the client's detail page

**Extensions**:
- 3a. If user cancels the deletion:
  - 3a1. System keeps the contact unchanged
  - 3a2. User returns to viewing the contact details

**Success Guarantee**: The contact no longer exists in the system and is removed from all associated client views
