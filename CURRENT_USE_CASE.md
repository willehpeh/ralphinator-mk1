# Use Case 4: Update Project Details

**Primary Actor**: Developer or Agency Owner

**Goal**: Modify project information to reflect changes in scope, timeline, budget, or description

**Preconditions**:
- User is viewing a project detail page
- Project is not deleted

**Main Success Scenario**:
1. User clicks "Edit Project" button
2. System displays update form pre-populated with current project data
3. User modifies project fields (name, description, dates, budget, status)
4. User submits the updated information
5. System validates the changes (date logic, positive budget, required fields)
6. System saves the changes and records the update in project history
7. System displays confirmation message
8. System returns user to project detail page with updated information

**Extensions**:
- 5a. Start date is after expected end date: System displays validation error and prompts correction
- 5b. Budget is negative or zero: System displays validation error
- 5c. Required fields are empty: System highlights missing fields with clear messages
- 6a. System error occurs: System displays error message and retains user's changes in form

**Success Guarantee**: Project information is updated and complete history of changes is preserved
