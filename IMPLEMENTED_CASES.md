# Implemented Use Cases

## Use Case 1: Add a New Client (2025-11-01, completed 2025-11-02)
- Full CQRS + Event Sourcing implementation with Clean Architecture
- Backend API endpoints: POST /api/clients, GET /api/clients/:id
- Frontend form component with reactive forms and validation
- Frontend: "Add New Client" button in ClientListComponent for easy access to creation form
- Frontend: Proper navigation flow from list → add → success → list
- Complete event-driven flow: Commands → Events → Projections → Read Models
- In-memory event store and read repository for development/testing
- All implementation tasks completed successfully including UI navigation
- End-to-end verification: Complete user flow working correctly (list → click button → form → submit → confirmation → back to list)
- Documentation: add-new-client.md

## Use Case 2: View All Clients (2025-11-02)
- Complete CQRS query implementation with read model projections
- Backend: GetAllClientsQuery and handler retrieve all clients from read repository
- Backend API endpoint: GET /api/clients returns array of ClientReadModel
- Frontend: ClientListComponent with NGRX state management (actions, reducer, selectors, effects)
- Frontend: Modern Angular implementation (standalone components, signals, OnPush detection)
- Frontend: Responsive client list UI with loading, error, and empty states
- Frontend: Status badges color-coded by client status (ACTIVE/INACTIVE/PENDING)
- Route: /clients set as default application route
- All 11 frontend tests passing (component behavior, state management, rendering)
- End-to-end verification: Complete data flow from UI → NGRX → API → Query Handler → Read Repository and back
- Documentation: UC2_VIEW_ALL_CLIENTS.md

## Use Case 3: View Client Details (2025-11-02)
- Complete client detail view implementation with routing and state management
- Backend: GetClientByIdQuery and handler retrieve single client by ID from read repository
- Backend API endpoint: GET /api/clients/:id returns ClientReadModel or null
- Frontend: ClientsService.getClientById() method for direct API calls to retrieve single client
- Frontend: NGRX selector selectClientById(id) for retrieving client from store by ID
- Frontend: Route configuration for /clients/:id with proper route parameter handling
- Frontend: ClientDetailComponent with modern Angular patterns (standalone, signals, OnPush)
- Frontend: Complete UI displaying all client information (name, status, email, phone, address, notes, metadata)
- Frontend: UI states implemented (loading, error, not found, success)
- Frontend: Click navigation from ClientListComponent to detail view with enhanced card hover effects
- Frontend: Back to list navigation preserves NGRX state
- Route: /clients/:id positioned correctly after /clients/add to avoid path conflicts
- End-to-end verification: Complete user flow from list → detail → back to list working correctly
- Documentation: UC3_View_Client_Details.md, view-client-details-tasks.md
- **Note**: Core functionality complete; unit/integration tests pending for future testing phase

## Use Case 4: Update Client Information (2025-11-02)
- Complete event-sourced client update implementation with CQRS pattern
- Backend: ClientInformationUpdatedDomainEvent domain event for capturing state changes
- Backend: ClientAggregate.updateInformation() method for business logic
- Backend: UpdateClientCommand and UpdateClientHandler for command processing
- Backend: ClientProjection updated to handle ClientInformationUpdatedDomainEvent
- Backend API endpoint: PUT /api/clients/:id accepts UpdateClientDto and returns { id: string }
- Frontend: ClientsService.updateClient() method for API communication
- Frontend: NGRX actions (updateClient, updateClientSuccess, updateClientFailure)
- Frontend: NGRX effect for orchestrating API calls and state updates
- Frontend: NGRX reducer cases for tracking loading and error states
- Frontend: EditClientFormComponent with reactive forms, validation, and output events
- Frontend: ClientDetailComponent with edit mode toggle using signals
- Frontend: "Edit Client" button in detail view that switches to edit mode
- Frontend: Cancel and save functionality with automatic view refresh after success
- Event sourcing: All client updates captured as immutable events in event store
- Optimistic concurrency: Version checking prevents concurrent update conflicts
- End-to-end verification: Complete user flow from detail view → edit → save → view updated data
- Documentation: UC4_UPDATE_CLIENT_INFORMATION.md

## Use Case 5: Change Client Status (2025-11-02)
- Complete event-sourced status change implementation with CQRS pattern
- Backend: ClientStatusChangedDomainEvent domain event for capturing status changes separately from general updates
- Backend: ClientAggregate.changeStatus() method enforces business rule (status must be different from current)
- Backend: ChangeClientStatusCommand and ChangeClientStatusHandler for command processing
- Backend: ClientProjection updated to efficiently handle ClientStatusChangedDomainEvent (partial update)
- Backend API endpoint: PATCH /api/clients/:id/status accepts ChangeClientStatusDto and returns { id: string }
- Frontend: ClientsService.changeClientStatus() method for API communication
- Frontend: NGRX actions (changeClientStatus, changeClientStatusSuccess, changeClientStatusFailure)
- Frontend: NGRX effect for orchestrating API calls and state updates
- Frontend: NGRX reducer cases for tracking loading and error states
- Frontend: ChangeStatusFormComponent with reactive forms, current status display, and status dropdown
- Frontend: ClientDetailComponent integrated with status change mode toggle using signals
- Frontend: "Change Status" button in detail view that switches to status change form
- Frontend: Cancel and save functionality with automatic view refresh after success
- Event sourcing: All status changes captured as immutable events in event store with audit trail (previous/new status)
- Optimistic concurrency: Version checking prevents concurrent update conflicts
- Efficient read model updates: Projection updates only status field instead of full client data
- End-to-end verification: Complete user flow from detail view → change status → save → view updated status
- Documentation: UC5_Change_Client_Status.md

## Use Case 6: Filter Clients by Status (2025-11-02)
- Complete CQRS query implementation for filtering clients by status
- Backend: GetClientsByStatusQuery accepts ClientStatus parameter ('Active' | 'Inactive' | 'Prospect' | 'Past Client')
- Backend: GetClientsByStatusQueryHandler executes query using read repository
- Backend: IClientReadRepository.findByStatus() port interface method for filtering
- Backend: InMemoryClientReadRepository.findByStatus() implementation filters clients by status
- Backend API endpoint: GET /api/clients/status/:status returns array of ClientReadModel matching status
- Frontend: ClientsService.getClientsByStatus() method for API communication
- Frontend: NGRX actions (filterClientsByStatus, filterClientsByStatusSuccess, filterClientsByStatusFailure)
- Frontend: NGRX effect for orchestrating API calls and state updates
- Frontend: NGRX reducer cases for updating clients array and tracking loading/error states
- Frontend: ClientListComponent enhanced with status filter dropdown UI
- Frontend: Filter controls with "All Clients", "Active", "Inactive", "Prospect", "Past Client" options
- Frontend: Signal-based filter state management with selectedFilter signal
- Frontend: Context-aware empty state messages based on selected filter
- Frontend: Styled filter controls with hover and focus states for better UX
- Query layer: Read model separation (queries don't use aggregates or event store)
- End-to-end verification: Complete user flow from selecting filter → backend API → filtered results displayed
- Documentation: UC6_FILTER_CLIENTS_BY_STATUS.md
- **Note**: Core functionality complete; unit/integration tests pending for future testing phase

## Use Case 7: Remove a Client from the System (2025-11-02)
- Complete event-sourced client deletion implementation with CQRS pattern
- Backend: ClientDeletedDomainEvent domain event for capturing deletion
- Backend: ClientAggregate.delete() method for business logic
- Backend: DeleteClientCommand and DeleteClientHandler for command processing
- Backend: ClientProjection updated to handle ClientDeletedDomainEvent (removes from read model)
- Backend API endpoint: DELETE /api/clients/:id accepts client ID and returns { id: string }
- Frontend: ClientsService.deleteClient() method for API communication
- Frontend: NGRX actions (deleteClient, deleteClientSuccess, deleteClientFailure)
- Frontend: NGRX effect for orchestrating API calls and navigation
- Frontend: NGRX reducer cases for removing client from state array
- Frontend: ConfirmationDialogComponent for user confirmation with custom styling
- Frontend: ClientDetailComponent with delete functionality using showDeleteConfirmation signal
- Frontend: "Delete Client" button in detail view that shows confirmation dialog
- Frontend: Cancel and confirm buttons in dialog with proper styling (danger red for confirm)
- Frontend: Automatic navigation to client list after successful deletion
- Event sourcing: All client deletions captured as immutable events in event store
- Optimistic concurrency: Version checking prevents concurrent deletion conflicts
- End-to-end verification: Complete user flow from detail view → delete → confirm → navigate to list
- Documentation: CURRENT_USE_CASE.md (to be archived)

## Use Case 8: Search for Clients by Name (2025-11-02)
- Complete client-side search implementation with NGRX state management
- Frontend: Search input field in ClientListComponent header with real-time filtering
- Frontend: searchTerm signal tracks current search query
- Frontend: NGRX action filterClientsByName(searchTerm) dispatched on input change
- Frontend: NGRX reducer handles client-side filtering with case-insensitive search on company name
- Frontend: ClientsState enhanced with allClients and searchTerm fields for filtering
- Frontend: Combined filtering support - search works together with status filter
- Frontend: Empty state message "No clients found matching your search" when no results
- Frontend: Client count display showing number of matching clients
- Frontend: Count display dynamically updates to show active search term and filter status
- Frontend: Proper singular/plural grammar ("client" vs "clients") in count display
- All extensions implemented: empty search results, clear search, combined search+filter
- End-to-end verification: Complete user flow from typing search → real-time filtering → seeing count → identifying desired client
- Documentation: search-clients-by-name-tasks.md

## Use Case 9: Start Development Environment (2025-11-01)
- Backend server starts successfully on http://localhost:3000/api
- Frontend application starts successfully on http://localhost:4200
- Full-stack integration verified with health check endpoint
- CORS enabled for cross-origin communication
- Single command `npm run dev` starts both services in parallel

## Use Case 10: Maintain Client Contact Information (2025-11-02)
- Complete implementation of email and phone contact information capture and validation
- Domain: Email value object with format validation (regex-based)
- Domain: ClientData updated to use Email value object instead of string
- Domain: ClientAggregate updated with Email type for email field
- Application: CreateClientHandler converts email string to Email value object with validation
- Application: UpdateClientHandler converts email string to Email value object with validation
- Infrastructure: ClientProjection serializes Email value object to string for read model persistence
- API: Email format validation using class-validator decorators (@IsEmail)
- API: Global ValidationPipe enabled in main.ts for automatic DTO validation
- Frontend: Email field in client forms with Validators.required and Validators.email
- Frontend: Email validation error messages displayed to users ("Email is required", "Please enter a valid email address")
- Frontend: Styled validation errors with .validation-error CSS class and red border on invalid inputs
- End-to-end validation: Email format validated at three layers (domain, API, frontend)
- Contact information is optional: Users can proceed without entering email or phone
- Partial contact information supported: Users can enter only email or only phone
- Extension 4a implemented: Invalid email format shows validation error to user
- Documentation: maintain-client-contact-information-tasks.md

## Use Case 11: Track Client Status Throughout Relationship Lifecycle (2025-11-02)
- This use case is fully satisfied by existing implementations (Use Cases 2, 3, 5, and 6)
- Users can view client status in multiple contexts:
  - List view: Status badges displayed for all clients (Use Case 2)
  - Detail view: Status badge prominently shown in client details (Use Case 3)
  - Filter view: Filter clients by specific status (Use Case 6)
- Users can change client status:
  - "Change Status" button in client detail view (Use Case 5)
  - Status change form with validation (Use Case 5)
  - Status changes persisted via event sourcing (Use Case 5)
- Status values: 'Active', 'Inactive', 'Prospect', 'Past Client'
- All extensions satisfied:
  - 2a: Prospect status visible and understandable
  - 2b: Active status visible and understandable
  - 2c: Inactive status visible and understandable
  - 2d: Past Client status visible and understandable
- Success guarantee met: Users can view status and understand client relationship stage
- Documentation: track-client-status-tasks.md

## Use Case 12: Record Additional Context About a Client (2025-11-02)
- This use case was already fully implemented as part of the initial client entity design (Use Case 1)
- Domain: ClientAggregate includes notes field with getter method
- Domain: ClientData value object includes notes parameter (optional)
- Domain: All domain events (ClientCreatedDomainEvent, ClientInformationUpdatedDomainEvent) handle notes
- Application: ClientReadModel includes notes field for query operations
- Infrastructure: ClientProjection persists notes to read model from domain events
- API: ClientDataDto validates notes as optional string field
- API: Create and update endpoints accept and persist notes through command handlers
- Frontend: ClientFormComponent includes notes textarea field with 4 rows
- Frontend: Notes field integrated into both create and edit modes
- Frontend: Notes included in form submission for both create and update operations
- Frontend: ClientDetailComponent displays notes in dedicated section when present
- Frontend: ClientListComponent shows notes in client cards when present
- Tests: Existing tests include notes validation in test data
- All requirements satisfied:
  - Users can enter observations and contextual information via textarea
  - System stores notes with client record via event sourcing
  - Notes visible in detail and list views for future reference
  - Notes are optional (can be left empty)
  - Notes can be of any reasonable length (no truncation)
  - Team members can access shared context about client
- Documentation: record-client-notes-tasks.md

## Use Case 13: List All Clients (2025-11-02)
- This use case is the same as "View All Clients" (Use Case 2) - already fully implemented
- Backend: GetAllClientsQuery and GetAllClientsQueryHandler retrieve all clients from read repository
- Backend API endpoint: GET /api/clients returns array of ClientReadModel
- Frontend: ClientListComponent displays all clients from NGRX store
- Frontend: Route /clients configured as default application route
- Complete CQRS query pattern with read model separation (no event store access)
- Comprehensive tests: packages/testing/src/tests/get-all-clients.handler.spec.ts
- Tests cover: retrieval of multiple clients, empty array case, different status types
- All acceptance criteria met:
  - User can request a list of all clients
  - System retrieves all client records
  - System displays the list with key information
  - System handles empty list case (displays empty array)
- Documentation: list-all-clients-tasks.md
