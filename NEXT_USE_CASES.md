# Use Cases for Story: Add a New Project to a Client

## Story ID
US-PROJECT-001

## Story Overview
As a software developer or agency owner, I want to create a new project record associated with a client so that I can track development projects, their status, timelines, and budget information.

---

## Use Case 1: Add a New Project to a Client

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

## Use Case 2: View All Projects for a Client

**Primary Actor**: Developer/Agency Owner

**Goal**: See all projects associated with a specific client to understand the client's project portfolio

**Preconditions**:
- The client exists in the system
- User is viewing the client's detail page

**Main Success Scenario**:
1. User navigates to a client's detail page
2. System retrieves all projects associated with the client
3. System displays the projects in the Projects section showing:
   - Project name
   - Status (with visual indicator)
   - Start date and end dates if available
   - Budget information if available
4. User can see the complete list of the client's projects

**Extensions**:
- **2a. Client has no projects**:
  - 2a1. System displays a message indicating no projects exist for this client
  - 2a2. System offers the option to add a new project
- **4a. User wants to see detailed information for a specific project**:
  - 4a1. User selects a project from the list
  - 4a2. System displays detailed project information (future use case)

**Success Guarantee**:
- User has visibility into all projects for the client
- Project information is accurately displayed

---

## Use Case 3: Set Project as Completed or Cancelled

**Primary Actor**: Developer/Agency Owner

**Goal**: Mark a project as finished and record when it ended

**Preconditions**:
- The project exists in the system
- User is creating or updating a project

**Main Success Scenario**:
1. User selects "Completed" or "Cancelled" as the project status
2. System enables the actual end date field
3. User optionally enters the actual end date
4. System validates that if provided, the actual end date is not before the expected end date
5. System records the status and actual end date
6. System confirms the update

**Extensions**:
- **4a. Actual end date is before expected end date**:
  - 4a1. System displays a validation warning
  - 4a2. User corrects the date or confirms the dates are accurate
  - 4a3. Continue from step 5
- **1a. User selects a status other than Completed or Cancelled**:
  - 1a1. System disables the actual end date field
  - 1a2. System clears any previously entered actual end date

**Success Guarantee**:
- Project status accurately reflects completion or cancellation
- Actual end date is recorded when the project finished

---

## Use Case 4: Track Project Budget

**Primary Actor**: Developer/Agency Owner

**Goal**: Record estimated budget for a project to track financial planning

**Preconditions**:
- User is creating or viewing a project

**Main Success Scenario**:
1. User enters a budget amount for the project
2. System validates that the budget is a positive number
3. System records the budget information
4. System displays the budget in the project information

**Extensions**:
- **2a. Budget is not a positive number**:
  - 2a1. System displays validation error
  - 2a2. User enters a valid positive amount
  - 2a3. Continue from step 3
- **1a. User does not provide a budget**:
  - 1a1. System accepts the project without budget information
  - 1a2. Budget field remains empty in project display

**Success Guarantee**:
- Project budget is accurately recorded if provided
- Project can be created with or without budget information

---

## Use Case 5: Validate Project Timeline

**Primary Actor**: Developer/Agency Owner

**Goal**: Ensure project dates are logically consistent

**Preconditions**:
- User is entering date information for a project

**Main Success Scenario**:
1. User enters a start date for the project
2. User enters an expected end date for the project
3. System validates that the start date is not after the expected end date
4. System accepts the timeline information
5. System records the project dates

**Extensions**:
- **3a. Start date is after expected end date**:
  - 3a1. System displays validation error indicating the timeline is inconsistent
  - 3a2. User corrects one or both dates
  - 3a3. Continue from step 3
- **1a. User provides only one date (start or expected end)**:
  - 1a1. System accepts the single date without additional validation
- **1b. User provides neither start nor expected end date**:
  - 1b1. System accepts the project without timeline information

**Success Guarantee**:
- Project timeline is logically consistent if dates are provided
- Invalid date combinations are prevented

---

## Business Rules Summary

The following business rules apply across all use cases:

1. **Required Information**: Project name and status are mandatory
2. **Client Association**: Every project must be associated with exactly one client
3. **Valid Status Values**: Status must be one of: Planning, Active, On Hold, Completed, Cancelled
4. **Actual End Date Constraint**: Actual end date can only be set when status is Completed or Cancelled
5. **Budget Constraint**: Budget must be a positive number if provided
6. **Timeline Validation**: Start date cannot be after expected end date (if both are provided)
7. **End Date Validation**: Expected end date cannot be after actual end date (if both are provided)

---

## Use Case Implementation Order

The recommended implementation order based on business value and dependencies:

1. **Use Case 1** - Add a New Project to a Client (foundational capability)
2. **Use Case 2** - View All Projects for a Client (immediate value after creation)
3. **Use Case 5** - Validate Project Timeline (part of Use Case 1, but distinct business rule)
4. **Use Case 4** - Track Project Budget (part of Use Case 1, but distinct business concern)
5. **Use Case 3** - Set Project as Completed or Cancelled (status management, can be part of Use Case 1 or future update story)

**Note**: Use Cases 3, 4, and 5 are business concerns that are technically implemented as part of Use Case 1 (the project creation form), but they represent distinct business goals and validation rules. They are separated to clearly identify the business value and rules for each capability.
