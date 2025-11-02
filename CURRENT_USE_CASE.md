# Current Use Case: Filter Clients by Status

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

**Status**: In Progress
**Started**: 2025-11-02
