# Use Cases: Contact Management

## Use Case 1: Add a New Contact to a Client

**Primary Actor**: Developer/User

**Goal**: Record a new contact person associated with a client company so that the user can maintain relationships with individuals at that organization.

**Preconditions**:
- At least one client exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User selects a client company from the list
2. User enters the contact person's name, role/title, email address, and phone number
3. System validates that all required information is provided and correctly formatted
4. System saves the contact and associates it with the selected client
5. System displays confirmation message with the new contact's details
6. System returns user to a view showing the contact information

**Extensions**:
- 2a. If user does not provide required fields (name, client):
  - 2a1. System highlights missing fields
  - 2a2. System prompts user to complete required information
  - 2a3. User provides missing information and continues at step 3
- 3a. If email address format is invalid:
  - 3a1. System displays validation error for email field
  - 3a2. User corrects the email address
  - 3a3. Continue at step 3
- 3b. If selected client does not exist:
  - 3b1. System displays error message
  - 3b2. User selects a different client or creates a new client first
  - 3b3. Continue at step 2

**Success Guarantee**: A new contact is recorded in the system, associated with the specified client, and can be retrieved for future reference.

---

## Use Case 2: View Contact Details

**Primary Actor**: Developer/User

**Goal**: View complete information about a specific contact person to review their details and relationship with their client company.

**Preconditions**:
- At least one contact exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User navigates to the contacts list or client detail page
2. User selects a specific contact from the list
3. System retrieves the contact's information
4. System displays complete contact details including name, role, email, phone, and associated client company
5. System displays when the contact was created and last updated

**Extensions**:
- 3a. If contact no longer exists:
  - 3a1. System displays "Contact not found" message
  - 3a2. System returns user to contacts list
- 4a. User wants to view the associated client details:
  - 4a1. System provides link to client detail page
  - 4a2. User can navigate to client details

**Success Guarantee**: User has viewed the complete, current information about the requested contact.

---

## Use Case 3: View All Contacts for a Specific Client

**Primary Actor**: Developer/User

**Goal**: See all contact persons associated with a particular client company to understand who the user works with at that organization.

**Preconditions**:
- At least one client exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User views a specific client's detail page
2. System retrieves all contacts associated with that client
3. System displays a list of contacts showing each person's name, role, email, and phone
4. System displays the total count of contacts for this client
5. User can select any contact to view more details

**Extensions**:
- 2a. If no contacts exist for this client:
  - 2a1. System displays "No contacts yet" message
  - 2a2. System offers option to add the first contact
- 3a. User wants to add a new contact for this client:
  - 3a1. System pre-selects the current client in the contact form
  - 3a2. Continue with Use Case 1 at step 2

**Success Guarantee**: User has viewed all current contacts associated with the specified client.

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

**Primary Actor**: Developer/User

**Goal**: Quickly add a new contact directly from a client's detail page without navigating away.

**Preconditions**:
- User is viewing a specific client's detail page
- Client exists in the system

**Main Success Scenario**:
1. User is viewing a client's detail page
2. User selects "Add Contact" option from the client page
3. System displays contact creation form with the current client pre-selected
4. User enters contact details (name, role, email, phone)
5. User submits the form
6. System validates and saves the contact associated with the current client
7. System displays success message
8. System updates the client page to show the new contact in the contacts list
9. User remains on the client detail page

**Extensions**:
- 6a. If validation fails:
  - 6a1. System highlights validation errors
  - 6a2. User corrects errors
  - 6a3. Continue at step 5
- 8a. User wants to add another contact:
  - 8a1. User selects "Add Contact" again
  - 8a2. Continue at step 3

**Success Guarantee**: A new contact is created and associated with the client, visible immediately on the client's detail page.

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
