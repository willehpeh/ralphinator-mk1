# Use Cases for US-CONTACT-001: Contact Management

## Business-Driven Use Cases (Alistair Cockburn Style)

These use cases describe **WHAT** users want to accomplish (business goals), not **HOW** to build the system.

---

## ✅ Use Case 1: Record a New Contact for a Client (COMPLETED 2025-11-03)

See IMPLEMENTED_CASES.md for full documentation.

---

## ✅ Use Case 2: Update Contact Information for an Existing Person (COMPLETED 2025-11-03)

See IMPLEMENTED_CASES.md for full documentation.

---

## Use Case 4: View Complete Information for a Specific Contact

**Primary Actor**: Developer or Agency Owner

**Goal**: Review all details about a specific person so I can verify information before reaching out or understand their complete profile

**Preconditions**:
- The contact exists in the system
- User has selected or navigated to a specific contact

**Main Success Scenario**:
1. User requests to see complete details for a specific contact
2. System displays all information for that contact (name, role, email, phone, notes, which client they work for)
3. System shows which client company the contact is associated with
4. User reviews the information
5. User can navigate to see the full client company details if desired
6. User can choose to update the contact's information or delete the contact

**Extensions**:
- 5a. If user navigates to the client company:
  - 5a1. System displays the client company's details
  - 5a2. User can see all other contacts for that company
- 6a. If user chooses to update information:
  - 6a1. Continue with Use Case 2 (Update Contact Information)
- 6b. If user chooses to delete the contact:
  - 6b1. Continue with Use Case 5 (Remove a Contact)

**Success Guarantee**: User has reviewed complete, accurate information about the contact and can take further actions if needed

---

## Use Case 5: Remove a Contact from the System

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

---

## Use Case 6: View All Contacts for a Specific Client

**Primary Actor**: Developer or Agency Owner

**Goal**: See all the people I interact with at a particular client company so I understand who to contact and the structure of my relationships there

**Preconditions**:
- User is viewing a specific client company's details
- The client exists in the system

**Main Success Scenario**:
1. User views a client company's details
2. System displays all contacts associated with that client (names, roles, email, phone)
3. User reviews the contacts at this client
4. User can select a specific contact to view complete details
5. User can add a new contact to this client

**Extensions**:
- 2a. If this client has no contacts yet:
  - 2a1. System displays message indicating no contacts have been recorded for this client
  - 2a2. System provides option to add first contact for this client
- 4a. If user selects a contact:
  - 4a1. Continue with Use Case 4 (View Complete Information)
- 5a. If user adds a new contact:
  - 5a1. Continue with Use Case 1 (Record a New Contact)
  - 5a2. Client is pre-selected since user came from client detail page

**Success Guarantee**: User can see the complete picture of their contacts at a specific client company

---

## Use Case Dependencies and Flow

**Typical User Journey**:
1. User views a client (from existing client management feature)
2. User sees contacts section on client detail → **Use Case 6**
3. User adds first contact for that client → **Use Case 1**
4. User later updates contact when person changes role → **Use Case 2**
5. User needs to find all contacts to send newsletter → **Use Case 3**
6. User looks up specific contact before meeting → **Use Case 4**
7. User removes contact when person leaves company → **Use Case 5**

**Independence**: Each use case represents an independently valuable business capability.
