# Current Use Case: Maintain Client Contact Information

## Use Case 5: Maintain Client Contact Information

**Primary Actor**: CRM User

**Goal**: Ensure the system has current contact methods for reaching the client when needed.

**Preconditions**:
- User is adding a new client or viewing an existing client

**Main Success Scenario**:
1. User has client contact information available
2. User enters client email address in the appropriate field
3. User enters client phone number in the appropriate field
4. System validates the email format is correct
5. System stores the contact information with the client record
6. Contact information is available for future communication needs

**Extensions** (alternative flows):
- 1a. User does not have contact information available:
  - 1a1. User proceeds without entering contact details (both are optional)
  - 1a2. Client is created without contact information
  - 1a3. Contact information can be added later when available
- 4a. Email format is invalid:
  - 4a1. System notifies user of format error
  - 4a2. User corrects the email format
  - 4a3. Returns to step 4
- 2a-3a. User has only email OR only phone:
  - 2a-3a1. User enters available contact method
  - 2a-3a2. System accepts partial contact information

**Success Guarantee**:
- Valid contact information is stored with the client record
- Contact information is available for future communication
- System maintains data quality by validating email formats

## Implementation Notes

This use case focuses on:
1. Adding email and phone fields to the Client aggregate
2. Implementing email validation as a value object
3. Creating domain events for contact information updates
4. Updating the command handler to accept contact information
5. Updating projections to include contact fields
6. Updating UI forms to capture contact information

## Dependencies
- Extends Use Case 1 (Add a New Client) - COMPLETED
- Extends Use Case 2 (View Client Details) - COMPLETED
