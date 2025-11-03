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

**Primary Actor**: Developer/User

**Goal**: Find specific contacts quickly by searching or filtering the complete contacts list.

**Preconditions**:
- At least one contact exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User navigates to the contacts list page
2. System displays all contacts in a searchable/filterable list
3. User enters search criteria (name, role, email, or client company)
4. System filters the list to show only matching contacts
5. System displays the filtered results with relevant details
6. User selects a contact to view details or continues refining search

**Extensions**:
- 4a. If no contacts match the search criteria:
  - 4a1. System displays "No contacts found" message
  - 4a2. System suggests clearing filters or broadening search
  - 4a3. User adjusts search and continues at step 3
- 4b. User wants to sort results:
  - 4b1. User selects sort criteria (name, client, role)
  - 4b2. System reorders the results accordingly

**Success Guarantee**: User has located the desired contact(s) through search and filtering.

---

## Use Case 5: Update Contact Information

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

**Primary Actor**: Developer/User

**Goal**: See all contacts across all clients to get an overview of all people the user works with.

**Preconditions**:
- User has access to the CRM system

**Main Success Scenario**:
1. User navigates to the contacts section
2. System retrieves all contacts from all clients
3. System displays contacts in a list showing name, role, email, phone, and associated client
4. System provides sorting and pagination for large lists
5. User can select any contact to view more details or filter by specific client

**Extensions**:
- 2a. If no contacts exist in the system:
  - 2a1. System displays "No contacts yet" message
  - 2a2. System offers option to create the first contact
- 3a. If list is very long (many contacts):
  - 3a1. System displays contacts in paginated view
  - 3a2. User can navigate between pages
  - 3a3. User can adjust number of items per page

**Success Guarantee**: User has viewed an overview of all contacts in the system with the ability to access details or filter as needed.

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
