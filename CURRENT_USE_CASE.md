# Use Case 2: Update Contact Information for an Existing Person

**Primary Actor**: Developer or Agency Owner

**Goal**: Keep contact information current as people change roles, phone numbers, or other details

**Preconditions**:
- The contact already exists in the system
- The user has located the specific contact they want to update

**Main Success Scenario**:
1. User indicates they want to modify information for a specific contact
2. System displays the current information for that contact
3. User changes one or more fields (role, email, phone, notes)
4. User confirms the changes
5. System validates the new information (email format, no duplicate names within same client)
6. System updates the contact record with the new information
7. System records when the update occurred
8. System confirms the update and displays the updated contact information

**Extensions**:
- 5a. If the new email format is invalid:
  - 5a1. System notifies user of the invalid email format
  - 5a2. User corrects the email address
  - 5a3. Return to step 5
- 5b. If changing the name would create a duplicate:
  - 5b1. System alerts user that another contact with this name exists for this client
  - 5b2. User modifies the name or cancels
  - 5b3. Return to step 3 or cancel
- 4a. If user cancels the operation:
  - 4a1. System discards the changes
  - 4a2. Contact information remains unchanged

**Success Guarantee**: The contact's information is updated with accurate, current details and the system records when the update was made

## Technical Implementation Notes

This use case requires:
- **Domain**: ContactUpdatedDomainEvent, ClientAggregate.updateContact() method
- **Application**: UpdateContactCommand, UpdateContactCommandHandler
- **Infrastructure**: Projection to handle ContactUpdatedDomainEvent
- **Backend API**: PUT /api/contacts/:id endpoint
- **Frontend**: Edit mode in contact detail component with form validation

## Acceptance Criteria
- User can edit name, role, email, phone fields for an existing contact
- Email validation enforced on updates
- Duplicate name validation within same client enforced
- System records updatedAt timestamp
- Changes reflected immediately in all views
- Cancel operation discards changes
