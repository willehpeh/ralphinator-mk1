# Current Use Case: Find and View All My Contacts

**Primary Actor**: Developer or Agency Owner

**Goal**: See all the people I have in my contact database so I can quickly locate someone or review my contacts

**Preconditions**:
- User has access to the system

**Main Success Scenario**:
1. User requests to see all their contacts
2. System displays a list of all contacts showing name, role, email, phone, and which client they're associated with
3. User reviews the contacts
4. User can select a specific contact to see full details

**Extensions**:
- 2a. If no contacts exist in the system:
  - 2a1. System displays a message indicating no contacts have been recorded yet
  - 2a2. System provides option to add first contact
- 3a. If user wants to narrow down the list:
  - 3a1. User can filter to show only contacts from a specific client
  - 3a2. System updates the list to show only matching contacts
- 3b. If user wants to find a specific person:
  - 3b1. User enters a person's name to search
  - 3b2. System updates the list to show only matching contacts
- 3c. If user wants to reorganize the list:
  - 3c1. User can sort by name, client, or role
  - 3c2. System reorders the list accordingly

**Success Guarantee**: User can see their contact list and locate specific contacts they're looking for

---

**Implementation Notes**:
- This is the first read operation for contacts
- Provides foundation for Use Case 4 (detail view) and Use Case 6 (client-specific list)
- Selected after completing Use Cases 1 & 2 (write operations)
- Order: Use Case 3 → Use Case 4 → Use Case 6 → Use Case 5
