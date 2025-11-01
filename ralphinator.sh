#!/bin/bash

################################################################################
# Ralph Wiggum Software Corporation
# Autonomous Software Development Workflow
#
# "Where every employee is Ralph, and every task is small enough for Ralph."
#
# Ralph's Roles:
# - CEO Ralph: Decides when project is done
# - Product Owner Ralph: Decides next story  
# - Business Analyst Ralph: Writes use cases
# - Architect Ralph: Follows clean architecture
# - Developer Ralph: Implements ONE tiny task ("Me do one thing!")
# - Code Reviewer Ralph: Refactors code
# - Project Manager Ralph: Sends notifications
#
# Core Principle: Me do one small thing. Me do it good. Me commit. Me done.
################################################################################

set -e
set -o pipefail

# Configuration
TOPIC="${NTFY_TOPIC:-}"
if [[ -z "$TOPIC" ]]; then
    echo "ERROR: NTFY_TOPIC environment variable must be set"
    echo "Usage: NTFY_TOPIC=your-topic ./agentic-workflow.sh"
    exit 1
fi

MAX_ITERATIONS="${MAX_ITERATIONS:-1000}"
LOG_LEVEL="${LOG_LEVEL:-1}"
GIT_BRANCH="${GIT_BRANCH:-$(git branch --show-current 2>/dev/null || echo 'main')}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    if [[ $LOG_LEVEL -ge 1 ]]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

log_success() {
    if [[ $LOG_LEVEL -ge 1 ]]; then
        echo -e "${GREEN}[SUCCESS]${NC} $1"
    fi
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_step() {
    echo ""
    echo -e "${GREEN}=======================================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}=======================================================${NC}"
    echo ""
}

file_exists() {
    [[ -f "$1" ]]
}

file_not_empty() {
    [[ -f "$1" ]] && [[ -s "$1" ]]
}

validate_environment() {
    log_info "Validating environment..."
    
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code is not installed or not in PATH"
        exit 1
    fi
    
    if [[ ! -d .git ]]; then
        log_error "Not a git repository. Please run 'git init' first."
        exit 1
    fi
    
    if ! git config user.name &> /dev/null || ! git config user.email &> /dev/null; then
        log_error "Git user.name and user.email must be configured"
        exit 1
    fi
    
    if [[ ! -f "PROMPT.md" ]]; then
        log_error "PROMPT.md not found"
        exit 1
    fi
    
    log_success "Environment validation complete"
}

execute_step_1() {
    log_step "STEP 1: Generate Story or Check Project Completion"
    log_info "CEO Ralph deciding: Project done? Or what story next? Me think hard..."
    
    if file_exists "STORY_COMPLETE.md"; then
        rm -f STORY_COMPLETE.md
    fi
    
    cat > /tmp/step1_prompt.md <<'EOF'
# Step 1: Story Generation or Project Completion

You are in Step 1 of an agentic software development workflow.

## Your Task

1. Read PROMPT.md to understand the project requirements
2. Read IMPLEMENTED_STORIES.md to see what has been completed (if it exists)
3. Assess whether the project is complete - have all requirements in PROMPT.md been fulfilled?

## If Project is Complete:
1. Create a file called PROJECT_COMPLETE.md containing:
   - A comprehensive summary of the entire project
   - List of all completed user stories
   - Overall accomplishments and project outcomes
2. Send a project completion notification using curl
3. Do nothing else - the workflow will terminate

## If Project is Not Complete:
1. Generate the next logical user story based on:
   - What requirements remain from PROMPT.md
   - What has already been implemented (in IMPLEMENTED_STORIES.md)
   - Logical progression of features
2. Write the user story to NEXT_STORY.md

## Important:
- You must choose ONE path: either create PROJECT_COMPLETE.md OR create NEXT_STORY.md
- Do not create both files
EOF

    log_info "Invoking Claude Code for Step 1..."
    claude -p --dangerously-skip-permissions /tmp/step1_prompt.md
    
    if file_exists "PROJECT_COMPLETE.md"; then
        log_success "Project marked as complete!"
    elif file_exists "NEXT_STORY.md"; then
        log_success "Next story generated"
    else
        log_error "Step 1 failed"
        exit 1
    fi
}

execute_step_2() {
    log_step "STEP 2: Break Down User Story into Use Cases"
    log_info "Business Analyst Ralph making use cases! Me use Alistair Cockburn style!"
    
    cat > /tmp/step2_prompt.md <<'EOF'
# Step 2: Use Case Breakdown (Alistair Cockburn Style)

You are in Step 2 of an agentic software development workflow.

## Your Task

1. Read NEXT_STORY.md to understand the user story
2. Break it down into BUSINESS-DRIVEN use cases in Alistair Cockburn style
3. Write all use cases to NEXT_USE_CASES.md
4. Delete NEXT_STORY.md

## Use Case Format (Alistair Cockburn)

Each use case MUST include:

**Use Case: [Goal-oriented title]**
- **Primary Actor**: Who wants to achieve this goal
- **Goal**: What the actor wants to accomplish (business goal, not technical)
- **Preconditions**: What must be true before this use case starts
- **Main Success Scenario**:
  1. Actor does [business action]
  2. System responds with [business outcome]
  3. Actor does [next action]
  4. etc.
- **Extensions** (alternative flows):
  - 2a. If [condition]: [what happens]
- **Success Guarantee**: What is true when use case completes successfully

## Critical Rules

- Focus on BUSINESS INTERACTIONS, not technical implementation
- Describe WHAT the user wants to accomplish, not HOW to build it
- Use business language, not code/database/API terms
- Each step should be a meaningful business action or system response
- NO technical details like "create API endpoint" or "design database schema"

## Examples of GOOD vs BAD

**BAD (Technical):**
- "Create REST API for clients"
- "Design client database schema"
- "Implement CRUD operations"

**GOOD (Business):**
- "Add a New Client to the System"
  - Primary Actor: Developer/User
  - Goal: Record a new client in the system
  - Main Success Scenario:
    1. User enters client company name and contact details
    2. System validates the information
    3. System saves the client
    4. System displays confirmation and client details

## Important:
- Order use cases logically by business flow and dependencies
- Each use case should be independently valuable to the business
EOF

    log_info "Invoking Claude Code for Step 2..."
    claude -p --dangerously-skip-permissions /tmp/step2_prompt.md
    
    if file_exists "NEXT_USE_CASES.md" && ! file_exists "NEXT_STORY.md"; then
        log_success "Use cases generated"
    else
        log_error "Step 2 failed"
        exit 1
    fi
}

execute_step_3() {
    log_step "STEP 3: Select Next Use Case"
    log_info "Product Owner Ralph picking which use case to do! Me choose wisely!"
    
    cat > /tmp/step3_prompt.md <<'EOF'
# Step 3: Use Case Selection

You are in Step 3 of an agentic software development workflow.

## Your Task

1. Read NEXT_USE_CASES.md to see all remaining use cases
2. Analyze which use case should be implemented next
3. Write the selected use case to CURRENT_USE_CASE.md
4. Create an empty task documentation file named after the use case

## Important:
- Choose the most logical next use case
- Do NOT remove anything from NEXT_USE_CASES.md yet
EOF

    log_info "Invoking Claude Code for Step 3..."
    claude -p --dangerously-skip-permissions /tmp/step3_prompt.md
    
    if file_exists "CURRENT_USE_CASE.md"; then
        log_success "Use case selected"
    else
        log_error "Step 3 failed"
        exit 1
    fi
}

execute_step_3_5() {
    log_step "STEP 3.5: Implement One Task"
    log_info "Developer Ralph coding! Me do ONE small thing! Me do good! Me commit!"
    
    cat > /tmp/step3_5_prompt.md <<EOF
# Step 3.5: Task Implementation - ONE SMALL ATOMIC TASK ONLY

You are in Step 3.5 of an agentic software development workflow.

## CRITICAL: You Must Implement ONLY ONE Task

This iteration is for implementing a SINGLE, SMALL, ATOMIC task. Not multiple tasks. Not a large task. ONE small task.

## What is a Task?

A task is the SMALLEST meaningful unit of work that:
- Can be completed in one focused coding session (15-30 minutes)
- Makes ONE specific change or addition
- Can be described in a single sentence
- Results in a single commit

## Examples of GOOD (Atomic) Tasks:

✅ "Create User aggregate root class with create method"
✅ "Add UserCreatedDomainEvent with required fields"
✅ "Implement CreateUserCommand handler to call aggregate"
✅ "Create UserReadModel DTO with basic fields"
✅ "Add GET endpoint for retrieving single user"
✅ "Write test for UserAggregate.create() method"

## Examples of BAD (Too Large) Tasks:

❌ "Implement complete user management system"
❌ "Build user CRUD with all endpoints"
❌ "Create user domain, application, and infrastructure layers"
❌ "Implement users with authentication and validation"

If you find yourself wanting to do any of these, STOP. Break it down into smaller tasks.

## Your Task This Iteration

1. Read CURRENT_USE_CASE.md to understand the use case
2. Read the task documentation file to see what's been completed
3. Read CLAUDE.md for implementation guidance
4. Identify the NEXT SMALLEST task needed
5. Implement ONLY that ONE task
6. Document it in the task file
7. Commit: git add . && git commit -m "descriptive message"
8. Assess if the use case is complete

## Task Size Guidelines

If your task involves more than ONE of these, it's too big:
- Creating multiple files
- Implementing multiple methods
- Adding multiple endpoints
- Writing multiple event handlers
- Creating multiple aggregates

Break it down further. Do ONE thing.

## If Use Case is Complete:

1. Push all commits: git push origin $GIT_BRANCH
2. Update IMPLEMENTED_CASES.md with the completed use case
3. Update IMPLEMENTED_STORIES.md if this completes a story
4. Remove this use case from NEXT_USE_CASES.md
5. Delete CURRENT_USE_CASE.md
6. Keep the task documentation file

## If Use Case is Not Complete:

1. Do NOT push
2. Do NOT delete CURRENT_USE_CASE.md
3. The next iteration will implement the next task

## Absolutely Critical:

- ONE task per iteration - not two, not three, ONE
- Small and atomic - if it feels large, make it smaller
- Single responsibility - the task does one thing
- Quick to implement - should take minutes, not hours
- Immediately committable - creates a clean, working state

Remember: The workflow will loop. You will be called again. There's no rush to do everything now.
Focus on doing ONE SMALL THING WELL.
EOF

    log_info "Invoking Claude Code for Step 3.5..."
    claude -p --dangerously-skip-permissions /tmp/step3_5_prompt.md
    
    if ! file_exists "CURRENT_USE_CASE.md"; then
        log_success "Use case completed"
    else
        log_success "Task completed"
    fi
}

execute_step_4() {
    log_step "STEP 4: Refactoring"
    log_info "Code Reviewer Ralph looking at code! Me make it cleaner! Me refactor one thing!"
    
    if ! file_exists "REFACTORING.md"; then
        touch REFACTORING.md
    fi
    
    cat > /tmp/step4_prompt.md <<EOF
# Step 4: Refactoring

You are in Step 4 of an agentic software development workflow.

## Your Task

1. Examine the codebase for refactoring opportunities
2. If you find a refactoring:
   - Implement ONE refactoring only
   - Commit: git add . && git commit -m "refactoring description"
   - Keep REFACTORING.md
3. If no more useful refactorings:
   - Push: git push origin $GIT_BRANCH
   - Delete REFACTORING.md

## Important:
- Only ONE refactoring per iteration
- Only push and delete REFACTORING.md when done
EOF

    log_info "Invoking Claude Code for Step 4..."
    claude -p --dangerously-skip-permissions /tmp/step4_prompt.md
    
    if ! file_exists "REFACTORING.md"; then
        log_success "Refactoring complete"
    else
        log_success "Refactoring iteration complete"
    fi
}

execute_step_5() {
    log_step "STEP 5: Story Completion Notification"
    log_info "Project Manager Ralph sending update! Me tell everyone story is done!"
    
    cat > /tmp/step5_prompt.md <<'EOF'
# Step 5: Story Completion Notification

You are in Step 5 of an agentic software development workflow.

## Your Task

1. Read IMPLEMENTED_STORIES.md and IMPLEMENTED_CASES.md
2. Create a summary of the completed story
3. Send notification using curl
4. Create STORY_COMPLETE.md

## Important:
- Keep notification concise
- Must create STORY_COMPLETE.md
EOF

    log_info "Invoking Claude Code for Step 5..."
    claude -p --dangerously-skip-permissions /tmp/step5_prompt.md
    
    if file_exists "STORY_COMPLETE.md"; then
        log_success "Notification sent"
    else
        log_error "Step 5 failed"
        exit 1
    fi
}

main() {
    log_info "Starting Ralph Wiggum Software Corporation!"
    log_info "Me build software! One small task at a time!"
    log_info "Topic: $TOPIC"
    log_info "Branch: $GIT_BRANCH"
    echo ""
    
    validate_environment
    
    if [[ ! -f "IMPLEMENTED_STORIES.md" ]]; then
        echo "# Implemented User Stories" > IMPLEMENTED_STORIES.md
    fi
    
    if [[ ! -f "IMPLEMENTED_CASES.md" ]]; then
        echo "# Implemented Use Cases" > IMPLEMENTED_CASES.md
    fi
    
    local iteration=0
    
    while true; do
        iteration=$((iteration + 1))
        log_info "=== Iteration $iteration ==="
        
        if [[ $iteration -gt $MAX_ITERATIONS ]]; then
            log_error "Maximum iterations reached"
            exit 1
        fi
        
        if file_exists "PROJECT_COMPLETE.md"; then
            log_success "Project complete! Me did it! Ralph Wiggum Software Corporation successful!"
            break
        fi
        
        if file_exists "CURRENT_USE_CASE.md"; then
            execute_step_3_5
        elif file_exists "REFACTORING.md"; then
            execute_step_4
        elif file_not_empty "NEXT_USE_CASES.md"; then
            execute_step_3
        elif file_exists "NEXT_USE_CASES.md" && ! file_not_empty "NEXT_USE_CASES.md"; then
            rm -f NEXT_USE_CASES.md
            execute_step_4
        elif file_exists "NEXT_STORY.md"; then
            execute_step_2
        elif file_exists "STORY_COMPLETE.md" || \
             (! file_exists "NEXT_STORY.md" && \
              ! file_exists "NEXT_USE_CASES.md" && \
              ! file_exists "CURRENT_USE_CASE.md" && \
              ! file_exists "REFACTORING.md"); then
            execute_step_1
        elif ! file_exists "REFACTORING.md" && \
             ! file_exists "NEXT_USE_CASES.md" && \
             ! file_exists "CURRENT_USE_CASE.md" && \
             ! file_exists "NEXT_STORY.md"; then
            execute_step_5
        else
            log_error "Unexpected state"
            exit 1
        fi
        
        sleep 1
    done
    
    log_success "Me did it! Ralph finished after $iteration iterations! Me good at software!"
}

trap 'echo "Interrupted"; exit 130' INT

main "$@"
