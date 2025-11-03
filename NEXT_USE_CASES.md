# Use Cases: Contact Management

## Use Case 2: View Contact Details

**Status**: IMPLEMENTED (2025-11-03)

This use case is now fully implemented. See Use Case 2 implementation in IMPLEMENTED_CASES.md.

Features include:
- GET /api/contacts/:id endpoint to retrieve individual contact details
- ContactDetailComponent displays all contact information (name, role, email, phone)
- Metadata display (contactId, createdAt, updatedAt timestamps)
- Link to associated client detail page
- Clickable contact cards in ContactListComponent navigate to detail view
- Professional UI with loading, error, and not found states
- Back button navigation to client detail page

---

## Use Case 3: View All Contacts for a Specific Client

**Status**: IMPLEMENTED (as part of Use Case 1)

This use case is already fully implemented. See Use Case 1 implementation in IMPLEMENTED_CASES.md.

The ClientDetailComponent includes:
- Contacts section that displays ContactListComponent
- GET /api/clients/:id/contacts endpoint retrieves all contacts for a client
- ContactListComponent shows all contacts in a responsive grid
- Each contact card displays name, role, email (with mailto: link), phone (with tel: link)
- Empty state message when no contacts exist
- "Add Contact" button to create first contact

---

## Use Case 4: Search and Filter Contacts

**Status**: IMPLEMENTED (2025-11-03)

This use case is now fully implemented. See Use Case 4 implementation in IMPLEMENTED_CASES.md.

Features include:
- Real-time search functionality filtering by name, role, email, and client name
- Sort functionality with three options: name, client, role
- Professional pill-group UI for sort controls with active state highlighting
- Responsive layout with flex-wrap for mobile devices
- "No contacts found" empty state with clear messaging
- Clear search button to reset search
- Dynamic contact count showing number of filtered results
- Signal-based reactive state management
- Client name display and filtering (fetched from backend)

---

## Use Case 5: Update Contact Information

**Status**: IMPLEMENTED (2025-11-03)

This use case is now fully implemented. See Use Case 5 implementation in IMPLEMENTED_CASES.md.

Features include:
- PUT /api/contacts/:id endpoint with UpdateContactDto validation
- ContactDetailComponent with edit mode using signals
- Edit form with reactive forms validation (name required, email format)
- Edit/Save/Cancel buttons with proper state management
- Loading state during save operation
- Success confirmation message with auto-hide after 3 seconds
- Error handling for save failures with separate error display
- Event sourcing with ContactUpdatedDomainEvent
- Contact read model updates via ContactProjection
- Professional UI with consistent design language

**Note**: Extension 8a (changing associated client) is not implemented as it's considered an advanced feature for future enhancement.

---

## Use Case 6: Remove a Contact from the System

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

---

## Use Case 7: View Complete Contact List

**Status**: IMPLEMENTED (2025-11-03)

This use case is now fully implemented. See Use Case 7 implementation in IMPLEMENTED_CASES.md.

Features include:
- GET /api/contacts endpoint to retrieve all contacts from all clients
- AllContactsComponent displays all contacts in professional responsive grid layout
- Contact cards show name, role, email, phone with SVG icons
- Client badge displays associated client ID for each contact
- Route /contacts configured for all contacts page
- Navigation to contact detail view by clicking cards
- Professional UI with loading, error, and empty states
- Contact count display showing total number of contacts
- Signal-based state management with OnPush change detection

---

## Use Case 8: Create Contact While Viewing a Client

**Status**: IMPLEMENTED (as part of Use Case 1)

This use case is already fully implemented. See Use Case 1 implementation in IMPLEMENTED_CASES.md.

The ClientDetailComponent includes:
- "Add Contact" button in the Contacts section
- ContactFormComponent that toggles on button click
- Client ID is pre-populated in the form
- Contact list updates automatically after successful submission
- User remains on client detail page after adding contact

---

## Use Case Dependencies and Order

The use cases are ordered to reflect typical business workflow:

1. **Use Case 1** (Add Contact) - Primary creation action
2. **Use Case 8** (Create Contact from Client Page) - Alternative creation workflow
3. **Use Case 2** (View Contact Details) - Basic retrieval
4. **Use Case 3** (View Contacts by Client) - Related retrieval
5. **Use Case 7** (View All Contacts) - Comprehensive retrieval
6. **Use Case 4** (Search/Filter) - Finding contacts
7. **Use Case 5** (Update Contact) - Modification
8. **Use Case 6** (Remove Contact) - Deletion

All use cases depend on the existence of the Client Management system, as contacts cannot exist without an associated client.
