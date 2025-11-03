# Current Use Case: Remove a Contact from the System

**Use Case 6: Remove a Contact from the System**

**Primary Actor**: Developer/User

**Goal**: Delete a contact person from the system when they are no longer relevant (left the company, relationship ended, duplicate entry).

**Preconditions**:
- Contact exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User views the contact's detail page
2. User selects the option to delete the contact
3. System displays confirmation dialog explaining the action
4. User confirms the deletion
5. System marks the contact as deleted
6. System displays success message
7. System returns user to the contacts list (without the deleted contact)

**Extensions**:
- 4a. If user cancels the deletion:
  - 4a1. System closes confirmation dialog
  - 4a2. Contact remains unchanged
  - 4a3. User remains on contact detail page
- 5a. If contact no longer exists:
  - 5a1. System displays "Contact not found" message
  - 5a2. System returns user to contacts list

**Success Guarantee**: Contact is removed from the system and no longer appears in lists or searches, while the historical record of the contact's existence is preserved.

## Implementation Notes

This use case will require:
- Backend: DELETE endpoint for contacts with event sourcing (ContactDeletedDomainEvent)
- Backend: Update projection to handle contact deletion (soft delete/mark as deleted)
- Frontend: Delete button on ContactDetailComponent
- Frontend: Confirmation dialog component
- Frontend: Navigation after successful deletion
- Frontend: Error handling for edge cases
