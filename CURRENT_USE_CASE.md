# Use Case 1: Add a New Project to a Client

## Story ID
US-PROJECT-001

## Use Case ID
UC-PROJECT-001-01

---

## Use Case: Add a New Project to a Client

**Primary Actor**: Developer/Agency Owner

**Goal**: Record a new project for a client to track its development lifecycle

**Preconditions**:
- The client exists in the system
- User is viewing the client's detail page

**Main Success Scenario**:
1. User initiates adding a new project for the client
2. System presents a project entry form with required and optional fields
3. User enters the project name (required)
4. User selects the project status (required) from available options: Planning, Active, On Hold, Completed, or Cancelled
5. User optionally enters project description
6. User optionally enters start date, expected end date, budget amount, and technical notes
7. User submits the project information
8. System validates that all required information is provided
9. System validates that business rules are satisfied
10. System records the project and associates it with the client
11. System confirms successful creation
12. System displays the new project in the client's project list

**Extensions**:
- **8a. Required information is missing**:
  - 8a1. System highlights missing required fields
  - 8a2. User provides missing information
  - 8a3. Continue from step 8
- **9a. Business rules are violated**:
  - 9a1. System displays validation errors (e.g., start date after expected end date)
  - 9a2. User corrects the information
  - 9a3. Continue from step 8
- **7a. User cancels the project creation**:
  - 7a1. System discards the entered information
  - 7a2. System returns to the client detail view without creating a project

**Success Guarantee**:
- A new project record exists in the system associated with the client
- The project information is accurately recorded and retrievable
- The project appears in the client's list of projects

---

## Business Rules (Relevant to this Use Case)

1. **Required Information**: Project name and status are mandatory
2. **Client Association**: Every project must be associated with exactly one client
3. **Valid Status Values**: Status must be one of: Planning, Active, On Hold, Completed, Cancelled
4. **Actual End Date Constraint**: Actual end date can only be set when status is Completed or Cancelled
5. **Budget Constraint**: Budget must be a positive number if provided
6. **Timeline Validation**: Start date cannot be after expected end date (if both are provided)
7. **End Date Validation**: Expected end date cannot be after actual end date (if both are provided)

---

## Technical Implementation Notes

This use case requires implementing the core project creation functionality with proper validation. The implementation follows the CQRS + Event Sourcing architecture:

### Key Components to Implement:
- **Domain**: ProjectAggregate, ProjectCreatedDomainEvent, ProjectStatus enum
- **Application**: CreateProjectCommand, CreateProjectCommandHandler, validation logic
- **Infrastructure**: ProjectProjection, InMemoryProjectReadRepository
- **API**: POST /api/clients/:id/projects endpoint
- **Frontend**: ProjectFormComponent with validation

### Validation Focus:
- Required field validation (name, status)
- Status enum validation
- Budget positivity validation
- Timeline consistency validation (start date <= expected end date)
- Actual end date logic (only enabled for Completed/Cancelled statuses)

---

## Implementation Priority

**Priority**: High (Foundational capability)

**Rationale**: This is the first and most critical use case. All other use cases (viewing projects, status management, budget tracking, timeline validation) depend on the ability to create projects. This establishes the Projects domain and its integration with the existing Clients domain.
