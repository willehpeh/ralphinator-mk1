# Current Use Case: Update Contact Information

**Use Case 5: Update Contact Information**

**Primary Actor**: Developer/User

**Goal**: Modify a contact's information when their details change (new role, updated email, different phone number).

**Preconditions**:
- Contact exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User views the contact's detail page
2. User selects the option to edit the contact
3. System displays an editable form with current contact information
4. User modifies one or more fields (name, role, email, phone)
5. User submits the changes
6. System validates the updated information
7. System saves the changes
8. System displays confirmation message with updated details
9. System shows the updated contact information

**Extensions**:
- 6a. If validation fails (invalid email format, missing required fields):
  - 6a1. System highlights validation errors
  - 6a2. User corrects the errors
  - 6a3. Continue at step 5
- 7a. If contact no longer exists:
  - 7a1. System displays "Contact not found" error
  - 7a2. System returns user to contacts list
- 8a. User wants to change the associated client:
  - 8a1. User selects a different client from the dropdown
  - 8a2. Continue at step 5

**Success Guarantee**: Contact information is updated with the new values, preserving the history of what changed and when.

## Implementation Notes

This use case requires:
1. **Backend**: Update contact command and handler following CQRS + Event Sourcing pattern
2. **Frontend**: Edit mode in ContactDetailComponent with form validation
3. **Events**: ContactUpdatedDomainEvent to track changes
4. **Projection**: Update read model when contact is modified
5. **UI/UX**: Edit/Cancel buttons, validation feedback, success confirmation

## Dependencies
- Depends on Use Case 2 (View Contact Details) being implemented
- Client selection dropdown depends on existing client list functionality
