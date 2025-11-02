# Use Cases for Client Management System

## Use Case 6: Filter Clients by Status

**Primary Actor**: Developer/Business User

**Goal**: View only clients with a specific status to focus on particular business relationships

**Preconditions**:
- User has access to the client management system
- Clients exist in the system

**Main Success Scenario**:
1. User is viewing client list
2. User selects status filter (Active, Inactive, Prospect, or Past Client)
3. System retrieves clients matching selected status
4. System displays filtered list
5. User reviews clients with that status

**Extensions**:
- 3a. If no clients match the selected status:
  - System displays message indicating no clients found with that status
  - System provides option to clear filter or try different status
- 2a. If user clears filter:
  - System displays all clients again

**Success Guarantee**: User sees only clients matching the selected status criteria

---

## Notes on Use Case Ordering

The use cases are ordered to reflect the typical business flow and dependencies:

1. **Add a New Client** - The foundational action; must be able to create clients
2. **View All Clients** - Once clients exist, need to see them
3. **View Client Details** - Natural progression from list to details
4. **Update Client Information** - Modify existing client data
5. **Change Client Status** - Special case of updating that reflects business relationship changes
6. **Filter Clients by Status** - More advanced querying once multiple clients exist

Each use case delivers independent business value and describes user goals in business terms without technical implementation details.

## Completed Use Cases

- **Use Case 1: Add a New Client** - Completed 2025-11-01 (See IMPLEMENTED_CASES.md)
- **Use Case 2: View All Clients** - Completed 2025-11-02 (See IMPLEMENTED_CASES.md)
- **Use Case 3: View Client Details** - Completed 2025-11-02 (See IMPLEMENTED_CASES.md)
- **Use Case 4: Update Client Information** - Completed 2025-11-02 (See IMPLEMENTED_CASES.md)
- **Use Case 5: Change Client Status** - Completed 2025-11-02 (See IMPLEMENTED_CASES.md)
- **Use Case 7: Start Development Environment** - Completed 2025-11-01 (See IMPLEMENTED_CASES.md)
