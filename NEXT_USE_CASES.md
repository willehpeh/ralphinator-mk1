# Use Cases: Communication Management (Alistair Cockburn Style)

## Use Case 3: Review Interaction Details

**Primary Actor**: Developer/Agency Owner

**Goal**: View complete details of a specific past interaction to understand what was discussed and what actions were agreed upon

**Preconditions**: At least one interaction exists in the system

**Main Success Scenario**:
1. User selects a specific interaction from the history
2. System displays the complete interaction record including:
   - Type of interaction
   - Topic discussed
   - Date and time it occurred
   - How long it lasted
   - Complete notes about what was discussed
   - Which client it was with (with ability to navigate to client details)
   - Which contact person was involved (with ability to navigate to contact details)
   - Which project it relates to (with ability to navigate to project details)
   - Whether follow-up is required
   - When follow-up is due
   - Whether follow-up has been completed
   - When the record was created and last modified
3. User can navigate to related client, contact, or project details
4. User can choose to update the interaction details
5. User can choose to mark a follow-up as complete
6. User can choose to delete the interaction record

**Success Guarantee**: User has reviewed the complete interaction details

---

## Use Case 4: Update Interaction Details

**Primary Actor**: Developer/Agency Owner

**Goal**: Correct or enhance information about a previously recorded interaction to ensure accurate records

**Preconditions**: The interaction to be updated exists in the system

**Main Success Scenario**:
1. User indicates they want to update an interaction's details
2. System presents the interaction details in an editable form
3. User modifies the information (type, topic, date, notes, associated client/contact/project, follow-up requirements)
4. User submits the changes
5. System validates the updated information
6. System saves the changes
7. System confirms the update was successful
8. System displays the updated interaction details

**Extensions**:
- 5a. If updated date is in the future:
  - 5a1. System rejects the change and asks user to correct the date
- 5b. If updated contact doesn't belong to the selected client:
  - 5b1. System rejects the change and asks user to select a valid contact
- 5c. If updated project doesn't belong to the selected client:
  - 5c1. System rejects the change and asks user to select a valid project
- 5d. If follow-up is required but no date is provided:
  - 5d1. System rejects the change and asks user to provide a follow-up date

**Success Guarantee**: The interaction record reflects the corrected or enhanced information

---

## Use Case 5: Complete Scheduled Follow-up

**Primary Actor**: Developer/Agency Owner

**Goal**: Mark a required follow-up action as completed so that it no longer appears in pending follow-ups and the record is complete

**Preconditions**:
- An interaction exists that requires follow-up
- The follow-up has not yet been marked complete

**Main Success Scenario**:
1. User indicates they have completed a follow-up action
2. System marks the follow-up as completed
3. System removes the interaction from the "requires follow-up" list
4. System confirms the follow-up has been marked complete
5. System displays the updated interaction showing follow-up is complete

**Extensions**:
- 1a. If the user completed the follow-up and had a new interaction:
  - 1a1. User records a new interaction documenting the follow-up conversation (Use Case 1)

**Success Guarantee**: The follow-up is marked complete and no longer appears in pending follow-up lists

---

## Use Case 6: Remove Interaction Record

**Primary Actor**: Developer/Agency Owner

**Goal**: Remove an incorrectly recorded or duplicate interaction from the system to maintain clean records

**Preconditions**: The interaction to be removed exists in the system

**Main Success Scenario**:
1. User indicates they want to delete an interaction
2. System asks user to confirm they want to remove this record
3. User confirms the deletion
4. System removes the interaction from the visible records
5. System confirms the interaction has been deleted
6. System returns user to the interactions list

**Extensions**:
- 3a. If user cancels the deletion:
  - 3a1. System returns to showing the interaction details without making changes

**Success Guarantee**: The interaction is no longer visible in the system's active records (note: the underlying event history is preserved for audit purposes)

---

## Use Case 7: Review All Client Interaction History

**Primary Actor**: Developer/Agency Owner

**Goal**: See complete interaction history with a specific client to prepare for a meeting or understand the relationship status

**Preconditions**: Client exists in the system

**Main Success Scenario**:
1. User is viewing a specific client's details
2. System displays a section showing all interactions with this client
3. User sees interaction history sorted chronologically (most recent first)
4. User can see key details: type, topic, date, follow-up status
5. User can select any interaction to view full details
6. User can quickly record a new interaction with this client (pre-associated)

**Extensions**:
- 2a. If no interactions exist for this client:
  - 2a1. System displays a message indicating no interactions recorded yet for this client

**Success Guarantee**: User has reviewed the complete interaction history for the specific client

---

## Use Case 8: Review Contact Person Interaction History

**Primary Actor**: Developer/Agency Owner

**Goal**: See all interactions with a specific contact person to understand communication history with that individual

**Preconditions**: Contact exists in the system

**Main Success Scenario**:
1. User is viewing a specific contact's details
2. System displays a section showing all interactions with this contact person
3. User sees interaction history sorted chronologically (most recent first)
4. User can see key details: type, topic, date, follow-up status
5. User can select any interaction to view full details
6. User can quickly record a new interaction with this contact (pre-associated)

**Extensions**:
- 2a. If no interactions exist with this contact:
  - 2a1. System displays a message indicating no interactions recorded yet with this contact

**Success Guarantee**: User has reviewed the complete interaction history for the specific contact person

---

## Use Case 9: Review Project Communication History

**Primary Actor**: Developer/Agency Owner

**Goal**: See all project-related communications to understand what has been discussed about the project

**Preconditions**: Project exists in the system

**Main Success Scenario**:
1. User is viewing a specific project's details
2. System displays a section showing all interactions related to this project
3. User sees interaction history sorted chronologically (most recent first)
4. User can see key details: type, topic, date, contact person, follow-up status
5. User can select any interaction to view full details
6. User can quickly record a new project-related interaction (pre-associated)

**Extensions**:
- 2a. If no interactions exist for this project:
  - 2a1. System displays a message indicating no interactions recorded yet for this project

**Success Guarantee**: User has reviewed the complete interaction history for the specific project

---

## Business Value Summary

These use cases enable:
- **Complete Audit Trail**: Every client interaction is documented with context
- **Follow-up Management**: Never miss a promised follow-up action
- **Context Before Meetings**: Quick review of past interactions prepares users for conversations
- **Relationship Understanding**: See patterns and frequency of communication with clients
- **Project Context**: Understand all discussions related to specific projects
- **Searchable History**: Find past conversations using multiple criteria
