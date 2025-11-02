# Current Use Case: View All Clients

**Use Case ID**: UC2

**Primary Actor**: Developer/Business User

**Goal**: See a list of all client companies to review business relationships

## Preconditions
- User has access to the client management system

## Main Success Scenario
1. User navigates to client list
2. System retrieves all clients
3. System displays list showing client names and key information
4. User browses the list

## Extensions
- 2a. If no clients exist:
  - System displays message indicating no clients found
  - System provides option to add first client
- 2b. If system takes time to load:
  - System displays loading indicator
  - System shows results when ready

## Success Guarantee
User can see all clients currently in the system

## Implementation Status
- **Selected**: 2025-11-01
- **Status**: Not Started
- **Completed**: N/A

## Technical Approach

### Backend (CQRS + Event Sourcing)
- **Query**: `GetAllClientsQuery`
- **Query Handler**: `GetAllClientsHandler`
- **Read Model**: `ClientListReadModel` (already built from events via projections)
- **Controller Endpoint**: `GET /api/clients`

### Frontend (Angular + NGRX)
- **Component**: `ClientListComponent`
- **NGRX Actions**: `loadClients`, `loadClientsSuccess`, `loadClientsFailure`
- **NGRX Selectors**: `selectAllClients`, `selectClientsLoading`, `selectClientsError`
- **Route**: `/clients` (will likely be root/default route)

## Dependencies
- Use Case 1 (Add a New Client) - COMPLETED
- Client projections must be working to populate read models

## Next Steps
1. Implement backend query and handler
2. Add controller endpoint
3. Create frontend component with NGRX integration
4. Add routing
5. Test end-to-end flow
